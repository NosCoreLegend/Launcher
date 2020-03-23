declare namespace MenuBarLessModule {
  export interface IMenuBarLess {
    closeLogo: string;
    menu: string;
    optionLogo: string;
    smallLogo: string;
  }
}

declare const MenuBarLessModule: MenuBarLessModule.IMenuBarLess & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: MenuBarLessModule.IMenuBarLess;
};

export = MenuBarLessModule;
