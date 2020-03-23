declare namespace ConfigurationComponentLessModule {
  export interface IConfigurationComponentLess {
    configurationMenu: string;
    configureButton: string;
    label: string;
  }
}

declare const ConfigurationComponentLessModule: ConfigurationComponentLessModule.IConfigurationComponentLess & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: ConfigurationComponentLessModule.IConfigurationComponentLess;
};

export = ConfigurationComponentLessModule;
