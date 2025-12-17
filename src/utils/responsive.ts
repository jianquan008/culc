export const breakpoints = {
  mobile: '320px',
  tablet: '768px',
  desktop: '1024px',
  large: '1440px'
} as const;

export const mediaQueries = {
  mobile: `@media (max-width: ${breakpoints.tablet})`,
  tablet: `@media (min-width: ${breakpoints.tablet}) and (max-width: ${breakpoints.desktop})`,
  desktop: `@media (min-width: ${breakpoints.desktop})`,
  large: `@media (min-width: ${breakpoints.large})`
} as const;

export const isMobile = () => {
  return window.innerWidth < parseInt(breakpoints.tablet);
};

export const isTablet = () => {
  return window.innerWidth >= parseInt(breakpoints.tablet) && 
         window.innerWidth < parseInt(breakpoints.desktop);
};

export const isDesktop = () => {
  return window.innerWidth >= parseInt(breakpoints.desktop);
};
