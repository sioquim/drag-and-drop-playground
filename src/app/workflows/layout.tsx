import { SimpleLayout } from 'src/layouts/simple';

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  return <SimpleLayout content={{ compact: false }}>{children}</SimpleLayout>;
}
