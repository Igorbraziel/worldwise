import { useState, useEffect } from "react";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import styles from "./Form.module.css";
import Button from "./Button";
import BackButton from "./BackButton";
import useURLPosition from "../hooks/useURLPosition";
import Message from "./Message";
import Spinner from "./Spinner";

import { useCities } from "../context/CitiesContext";
import { useNavigate } from "react-router-dom";

export function convertToEmoji(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}

const ApiUrl = "https://api.bigdatacloud.net/data/reverse-geocode-client";

function Form() {
  const [cityName, setCityName] = useState("");
  const [country, setCountry] = useState("");
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState("");
  const [lat, lng] = useURLPosition();
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [emoji, setEmoji] = useState("");
  const [geocodingError, setGeocodingError] = useState("");

  const navigate = useNavigate();

  const { createCity, isLoading } = useCities();

  useEffect(
    function () {
      async function fetchCityData() {
        try {
          if (!lat || !lng) return;
          setGeocodingError("");
          setIsLoadingLocation(true);
          const response = await fetch(
            `${ApiUrl}?latitude=${lat}&longitude=${lng}`
          );
          const data = await response.json();

          if (!data.countryCode)
            throw new Error(
              "That doesn't seem to be a city. Click somewhere else"
            );

          setCityName(data.city || data.locality || "");
          setCountry(data.countryName || "");
          setEmoji(convertToEmoji(data.countryCode));
        } catch (error) {
          setGeocodingError(error.message);
        } finally {
          setIsLoadingLocation(false);
        }
      }
      fetchCityData();
    },
    [lat, lng]
  );

  async function handleSubmit(e) {
    e.preventDefault();

    if(!date || !cityName) return;

    const newCity = {
      cityName,
      country,
      emoji,
      date,
      notes,
      position: {lat, lng}
    }

    await createCity(newCity);
    navigate("/app/cities");
  }

  if (isLoadingLocation) return <Spinner />;
  if (!lat || !lng)
    return <Message message={"Start by clicking somewhere on the map!"} />;
  if (geocodingError) return <Message message={geocodingError} />;

  return (
    <form className={`${styles.form} ${isLoading ? styles.loading : ""}`} onSubmit={handleSubmit}>
      <div className={styles.row}>
        <label htmlFor="cityName">City name</label>
        <input
          id="cityName"
          onChange={(e) => setCityName(e.target.value)}
          value={cityName}
        />
        <span className={styles.flag}>{emoji}</span>
      </div>

      <div className={styles.row}>
        <label htmlFor="date">When did you go to {cityName}?</label>
        <DatePicker
          id="date"
          dateFormat="MM/dd/yyyy"
          onChange={(date) => setDate(date)}
          selected={date}
          placeholderText="MM/dd/yyyy"
        />
      </div>

      <div className={styles.row}>
        <label htmlFor="notes">Notes about your trip to {cityName}</label>
        <textarea
          id="notes"
          onChange={(e) => setNotes(e.target.value)}
          value={notes}
        />
      </div>

      <div className={styles.buttons}>
        <Button type="primary">Add</Button>
        <BackButton />
      </div>
    </form>
  );
}

export default Form;
