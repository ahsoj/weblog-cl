import type { ISODateString, SizeType, TabsType, UpdateSession } from './types';

export interface ISidebarProps {
  onSidebarOpen?: () => void;
  onSidebarClose?: () => void;
  isOpen: boolean;
}

export interface IFormatButton {
  isMarkActive: Function;
  toggleMark: Function;
  format: string;
  icon: JSX.Element;
}

export interface IBlockButton {
  isBlockActive: Function;
  toggleBlock: Function;
  format: string;
  icon: JSX.Element;
}

export interface UserInfo {
  userId: number;
  email: string;
  iat?: number;
  exp?: number;
  username: string;
}
export interface LoginCredential {
  email: string;
  password: string;
  remember?: boolean | undefined;
}

export interface RegisterCredential {
  name?: string;
  email: string;
  password: string;
}

export interface DefaultSession {
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
  expires: ISODateString;
}
export interface Session extends DefaultSession {}
export type SessionContextValue<R extends boolean = false> = R extends true
  ?
      | { update: UpdateSession; data: Session; status: 'authenticated' }
      | { update: UpdateSession; data: null; status: 'loading' }
  :
      | { update: UpdateSession; data: Session; status: 'authenticated' }
      | {
          update: UpdateSession;
          data: null;
          status: 'unauthenticated' | 'loading';
        };

export interface UseSessionOptions<R extends boolean> {
  required: R;
  /** Defaults to `signIn` */
  onUnauthenticated?: () => void;
}

export interface TabsProps extends Omit<RcTabsProps, 'editable'> {
  rootClassName?: string;
  type?: TabsType;
  size?: SizeType;
  hideAdd?: boolean;
  centered?: boolean;
  addIcon?: React.ReactNode;
  onEdit?: (
    e: React.MouseEvent | React.KeyboardEvent | string,
    action: 'add' | 'remove'
  ) => void;
  children?: React.ReactNode;
}

export interface RcTabsProps {
  items: RcTabItemsProps[];
  activeKey: number;
  handleActiveTabKey: (key: number) => void;
}

export interface CurrentCount {
    articles: number;
    followings: number;
    followers: number;
};

export interface RcTabItemsProps {
  key: number;
  label: string;
  path: string;
  children: React.ReactNode;
}
