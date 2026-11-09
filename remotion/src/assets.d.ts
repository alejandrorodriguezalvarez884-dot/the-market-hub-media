// Pictures imported by the kit and the slides: webpack gives their address.
declare module "*.jpg" { const url: string; export default url; }
declare module "*.png" { const url: string; export default url; }
declare module "*.svg" { const url: string; export default url; }
