import styles from "./CountryList.module.css";
import Spinner from "./Spinner";
import CountryItem from "./CountryItem";
import Message from "./Message";

import { useCities } from "../context/CitiesContext";

function CountryList() {
  const { cities, isLoading } = useCities();
  if (isLoading) return <Spinner />;

  if (!cities.length)
    return (
      <Message>Add your first city by clicking on a city on the map</Message>
    );

  const countries = cities.reduce(
    (accumulator, city) =>
      accumulator.map(country=>country.country).includes(city.country)
        ? accumulator
        : [...accumulator, {country: city.country, emoji: city.emoji}],
    []
  );

  return (
    <ul className={styles.countryList}>
      {countries.map(country=><CountryItem country={country.country} emoji={country.emoji} key={country.country}/>)}
    </ul>
  );
}

export default CountryList;
