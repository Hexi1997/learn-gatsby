import { navigate } from 'gatsby';

function IndexPage() {
  if (typeof window !== 'undefined') {
    void navigate('/homepage');
  }

  return null;
}

export default IndexPage;
