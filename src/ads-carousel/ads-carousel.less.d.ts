declare namespace AdsCarouselLessModule {
  export interface IAdsCarouselLess {
    adsCarousel: string;
    carouselItem: string;
  }
}

declare const AdsCarouselLessModule: AdsCarouselLessModule.IAdsCarouselLess & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: AdsCarouselLessModule.IAdsCarouselLess;
};

export = AdsCarouselLessModule;
