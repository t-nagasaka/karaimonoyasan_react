// 型情報をBlobからエクステンド
export interface File extends Blob {
  readonly lastModified: number;
  readonly name: string;
}

export interface PROPS_NEWPOST {
  title: string;
  spicyResist: string;
  img: File | null;
}

export interface PROPS_LIKED {
  id: number;
  title: string;
  current: number[];
  new: number;
}

export interface PROPS_COMMENT {
  text: string;
  post: number;
}
