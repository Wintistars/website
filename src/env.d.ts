interface ImportMetaEnv {
  readonly STORYBLOK_TOKEN?: string;
  readonly STORYBLOK_VERSION?: 'draft' | 'published';
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
