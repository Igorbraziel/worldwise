import styles from "./CountryItem.module.css";

function CountryItem({ country, emoji }) {
  return (
    <li className={styles.countryItem}>
      <span>{emoji}</span>
      <span>{country}</span>
    </li>
  );
}

export default CountryItem;
