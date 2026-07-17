"use client";

import { useState } from "react";
import BrandLogo from "@/component/common/BrandLogo/BrandLogo";
import { navItems } from "@/data/landingData";
import styles from "./Header.module.scss";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = () => setIsOpen(false);

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <BrandLogo />

        <button
          type="button"
          className={`${styles.menuButton} ${isOpen ? styles.active : ""}`}
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label="메뉴 열기"
          aria-expanded={isOpen}
        >
          <span />
          <span />
          <span />
        </button>

        <div className={`${styles.menuArea} ${isOpen ? styles.open : ""}`}>
          <nav className={styles.nav} aria-label="주요 메뉴">
            {navItems.map((item) => (
              <a key={item.href} href={item.href} onClick={closeMenu}>
                {item.label}
              </a>
            ))}
          </nav>

          <div className={styles.actions}>
            <a href="#contact" onClick={closeMenu}>
              로그인
            </a>
            <a
              className={styles.primaryAction}
              href="#contact"
              onClick={closeMenu}
            >
              대쉬보드
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
