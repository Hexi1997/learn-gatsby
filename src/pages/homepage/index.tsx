import cn from 'classnames';
import { Link } from 'gatsby';
import { StaticImage } from 'gatsby-plugin-image';
import React from 'react';

import Seo from '@/components/seo';

import * as styles from './index.module.less';

interface HomepageProps {
  className?: string;
}

function Homepage(props: HomepageProps) {
  const { className } = props;

  return (
    <div className={cn(styles.Homepage, className)}>
      <Seo title="Home" />

      <StaticImage
        src="../../images/gatsby-astronaut.png"
        width={300}
        quality={95}
        formats={['auto', 'webp', 'avif']}
        alt="A Gatsby astronaut"
        style={{ marginBottom: `1.45rem` }}
      />

      <p>
        <Link className="text-3xl" to="/simple/">
          Go to Simple
        </Link>
      </p>
    </div>
  );
}

export default Homepage;
