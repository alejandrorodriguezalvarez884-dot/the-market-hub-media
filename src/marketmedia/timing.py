"""When each word of a scene is said.

The voice service gives a sound file and nothing else: no time for each word. It is worked out
here, well enough for a slide to bring a thing in as the voice names it and for the Short's
captions to keep up.

A voice stops at a full stop, and often at a comma: those silences can be heard in the sound
(mouth.py gives how loud it is at each frame). So the stops written in the narration are matched
to the silences of the voice, in order, and between two of them the words share the time the
voice is sounding, each by its length. With no voice yet, the words share the time the scene is
assumed to last.
"""

from __future__ import annotations

from dataclasses import dataclass

LINE_CHARS = 16   # a caption of the Short: a few words, large
LINE_WORDS = 3
LINGER = 0.35     # seconds the last caption of a scene stays after its last word
PAUSE = 0.13      # a silence at least this long is the voice stopping, not a consonant
# What it costs, in seconds of error, to leave one side of a match without the other.
NO_PAUSE_AT_STOP, NO_PAUSE_AT_COMMA, NO_STOP_AT_PAUSE = 1.2, 0.1, 0.5
STOPS, COMMAS = ".!?…:", ",;"


@dataclass(frozen=True)
class Word:
    word: str    # as written, with its punctuation
    at: float    # seconds from the start of the scene
    end: float


def _weight(word: str, pauses: bool) -> float:
    """How much of the time a word takes: its letters and, when pauses are not heard, its stop."""
    letters = sum(c.isalnum() for c in word) + 1.5
    if pauses and word[-1:] in STOPS:
        letters += 5
    elif pauses and word[-1:] in COMMAS:
        letters += 2
    return letters


def silences(levels: list[float], fps: int) -> list[tuple[int, int]]:
    """The stretches of frames, inside the voice, where it stops: (first silent, first sounding again)."""
    out, start = [], None
    for n, level in enumerate(levels):
        if level <= 0 and start is None:
            start = n
        elif level > 0 and start is not None:
            if start > 0 and n - start >= PAUSE * fps:
                out.append((start, n))
            start = None
    return out


def _anchors(tokens: list[str], weights: list[float], levels: list[float], fps: int) -> list[tuple[int, int, int]]:
    """Which written stop is which silence of the voice: (the word that ends at it, the silence's
    first frame, the first frame after it), in order. The match that leaves each stretch of
    words closest to the time its letters would take, at the pace of the whole scene."""
    stops = [n for n, t in enumerate(tokens[:-1]) if t[-1:] in STOPS + COMMAS]
    pauses = silences(levels, fps)
    if not stops or not pauses:
        return []
    sounding = [0]
    for level in levels:
        sounding.append(sounding[-1] + (level > 0))
    done = [0.0]
    for weight in weights:
        done.append(done[-1] + weight)
    pace = done[-1] / max(1, sounding[-1])   # weight per sounding frame

    def stretch(word_from: int, word_to: int, frame_from: int, frame_to: int) -> float:
        """How far the words word_from..word_to are from fitting the frames between two silences."""
        return abs((sounding[frame_to] - sounding[frame_from]) - (done[word_to + 1] - done[word_from]) / pace) / fps

    def unmatched(stop_from: int, stop_to: int, pause_from: int, pause_to: int) -> float:
        return (sum(NO_PAUSE_AT_STOP if tokens[stops[i]][-1] in STOPS else NO_PAUSE_AT_COMMA for i in range(stop_from, stop_to))
                + NO_STOP_AT_PAUSE * (pause_to - pause_from))

    # best[i][j]: the least error with stop i at pause j, and the match before it.
    best: dict[tuple[int, int], tuple[float, tuple[int, int] | None]] = {}
    for i, stop in enumerate(stops):
        for j, (quiet, loud) in enumerate(pauses):
            choice = (stretch(0, stop, 0, quiet) + unmatched(0, i, 0, j), None)
            for (pi, pj), (cost, _) in list(best.items()):
                if pi < i and pj < j:
                    total = cost + stretch(stops[pi] + 1, stop, pauses[pj][1], quiet) + unmatched(pi + 1, i, pj + 1, j)
                    if total < choice[0]:
                        choice = (total, (pi, pj))
            best[(i, j)] = choice
    last = len(tokens) - 1
    ends = {key: cost + stretch(stops[key[0]] + 1, last, pauses[key[1]][1], len(levels))
            + unmatched(key[0] + 1, len(stops), key[1] + 1, len(pauses)) for key, (cost, _) in best.items()}
    nothing = stretch(0, last, 0, len(levels)) + unmatched(0, len(stops), 0, len(pauses))
    key = min(ends, key=ends.get)
    if ends[key] >= nothing:
        return []
    chain = []
    while key is not None:
        chain.append((stops[key[0]], *pauses[key[1]]))
        key = best[key][1]
    return chain[::-1]


def words(narration: str, spoken: float, levels: list[float] | None = None, fps: int = 30) -> list[Word]:
    """The words of a narration, each with when it starts and ends. ``levels`` is the voice, a
    number per frame (mouth.py); without it the words are spread over ``spoken`` seconds."""
    tokens = narration.split()
    if not tokens:
        return []
    levels = levels or []
    if not any(level > 0 for level in levels):
        weights = [_weight(t, pauses=True) for t in tokens]
        total, done, out = sum(weights), 0.0, []
        for token, weight in zip(tokens, weights):
            out.append(Word(token, round(done / total * spoken, 3), round((done + weight) / total * spoken, 3)))
            done += weight
        return out

    weights = [_weight(t, pauses=False) for t in tokens]
    out: list[Word] = []
    first, frame = 0, 0
    for stop, quiet, loud in [*_anchors(tokens, weights, levels, fps), (len(tokens) - 1, len(levels), len(levels))]:
        # The words up to this stop share the frames of the voice up to its silence.
        sounding = [n for n in range(frame, quiet) if levels[n] > 0] or [frame]
        total, done = sum(weights[first: stop + 1]), 0.0
        for n in range(first, stop + 1):
            at = sounding[min(len(sounding) - 1, int(done / total * len(sounding)))] / fps
            done += weights[n]
            end = (sounding[-1] + 1) / fps if done >= total else sounding[int(done / total * len(sounding))] / fps
            out.append(Word(tokens[n], round(at, 3), round(end, 3)))
        first, frame = stop + 1, loud
    return out


def lines(said: list[Word], seconds: float) -> list[dict]:
    """The Short's captions for one scene: a few words at a time, a new line at each stop."""
    groups: list[list[Word]] = []
    for word in said:
        last = groups[-1] if groups else None
        full = last and (len(last) >= LINE_WORDS or len(" ".join(w.word for w in last)) + 1 + len(word.word) > LINE_CHARS
                         or last[-1].word[-1:] in ".!?…:")
        if last is None or full:
            groups.append([word])
        else:
            last.append(word)
    out = []
    for n, group in enumerate(groups):
        end = groups[n + 1][0].at if n + 1 < len(groups) else min(seconds, group[-1].end + LINGER)
        out.append({"at": group[0].at, "end": end, "words": [{"word": w.word, "at": w.at} for w in group]})
    return out
