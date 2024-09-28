import { Session } from "next-auth";


export type CustomUser = {
  login_key?: string | null;
  name?: string | null;
  email?: string | null;
  avatar?: {
    url?: string | null;
    filename?: string | null;
  };
  role?: string | null;
  _id?: string | null;
  id?: string | null;
  username?: string | null;
  usertype?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  status?: boolean | null;
};

export type CustomSession = Session & {
  user?: CustomUser | null;
  expires?: string | null;
};