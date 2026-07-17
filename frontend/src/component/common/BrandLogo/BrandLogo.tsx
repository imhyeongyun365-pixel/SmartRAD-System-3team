import styles from "./BrandLogo.module.scss";

interface BrandLogoProps {
  inverse?: boolean;
}

export default function BrandLogo({ inverse = false }: BrandLogoProps) {
  return (
    <a className={`${styles.brand} ${inverse ? styles.inverse : ""}`} href="#top">
      <span className={styles.symbol} aria-hidden="true">
        <span />
        <span />
      </span>
      <span className={styles.name}>SmartRAD HR</span>
    </a>
  );
}
