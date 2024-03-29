import React, { useState, useRef } from "react";
import { API } from "./weather.config";

function Weather() {
  const [location, setLocation] = useState("");
  const [forCustomCity, setForCustomCity] = useState(false);
  const [weather, setWeather] = useState();
  const [moreDetails, setMoreDetails] = useState(false);
  const [weatherDetails, setWeatherDetails] = useState();

  const customCity = useRef();
  if (navigator.geolocation && !forCustomCity) {
    if (location.length === 0) {
      navigator.geolocation.getCurrentPosition(success, error);
    }
  } else {
    console.log("Geolocation not supported");
  }

  function success(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    setLocation({ latitude, longitude });
    console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
    // Make API call to OpenWeatherMap
    if (location.length === 0) {
      fetch(
        `https://api.weatherapi.com/v1/current.json?key=${API.apiKey}&q=${latitude},${longitude}&days=1&aqi=no&alerts=no`
      )
        .then(
          console.log(
            `https://api.weatherapi.com/v1/current.json?key=${API.apiKey}&q=${latitude},${longitude}&days=1&aqi=no&alerts=no`
          )
        )
        .then((response) => response.json())
        .then((data) => {
          setWeather(data);
          setWeatherDetails([
            weather.location.region,
            weather.location.country,
            weather.wind_kph,
            weather.feelslike_c,
            weather.humidity,
          ]);
          console.log(data);
        })
        .catch((error) => console.log(error));
    }
  }
  async function getWeatherFromCity(e) {
    try {
      let newWeather = await fetch(
        `https://api.weatherapi.com/v1/current.json?key=${API.apiKey}&q=${customCity.current.value}&days=1&aqi=no&alerts=no`
      );
      newWeather = newWeather.json();
      setWeather(newWeather);
    } catch (error) {
      console.log(error);
    }
  }
  function error() {
    console.log("Unable to retrieve your location");
  }
  return (
    <div className="flex flex-col justify-center items-center w-screen h-screen bg-cover sm:bg-[url(D:\Projects\React\learningreact\src\WeatherApp\assets\mobilebackground.jpg)] md:bg-[url(D:\Projects\React\learningreact\src\WeatherApp\assets\pcbackground.jpg)] bg-[url(D:\Projects\React\learningreact\src\WeatherApp\assets\mobilebackground.jpg)] xs:bg-[url(D:\Projects\React\learningreact\src\WeatherApp\assets\mobilebackground.jpg)] text-teal-900 md:text-white">
      <div className="flex flex-col rounded-[2rem] justify-center items-center md:w-[36.75rem] md:h-[16rem] lg:w-[42.5rem] lg:h-[18.25rem] sm:w-[31rem] sm:h-[14.25rem] h-[13.15rem] w-[27.5rem] backdrop-blur-lg"></div>
      <div className="flex flex-col justify-center items-center w-screen h-screen absolute">
        <h1 className="md:text-5xl lg:text-6xl text-4xl text-center font-extrabold xs:top-[12%] sm:top-[10%] top-[10%] absolute">
          Whatever Weather
        </h1>
        <div className="flex flex-row  justify-center items-center top-0 rounded-[2rem] md:w-[36.75rem] md:h-[16rem] lg:w-[42.5rem] lg:h-[18.25rem] sm:w-[31rem] sm:h-[14.25rem] h-[13.15rem] w-[27.5rem] p-3 border-l-2  border-r-2 border-l-[#63cca9] border-r-[#63cca9]">
          {weather && (
            <div className="w-auto animate-pulse hover:animate-none hover:cursor-pointer flex flex-row mx-4">
              <p className="md:text-5xl sm:text-4xl text-3xl lg:text-6xl font-bold mx-3">
                {weather.current.temp_c}
              </p>
              <p className="text-sm flex justify-center">
                <sup className="font-bold text-sm">o</sup>
              </p>
              <p className="md:text-5xl sm:text-4xl text-3xl lg:text-6xl font-bold">
                C
              </p>
              <div className=" w-[20%] h-[20%]">
                <img
                  className=""
                  src={weather.current.condition.icon}
                  alt="current weather icon"></img>
              </div>
            </div>
          )}
          {weather && location.length !== 0 && (
            <div className=" flex flex-col">
              <p className="md:text-5xl sm:text-4xl text-3xl lg:text-6xl font-bold">
                {weather && weather.location.name}
              </p>
              {}
              <p className=" h-auto md:text-4xl sm:text-3xl text-2xl lg:text-5xl p-1">
                {weather.location.region}
              </p>

              <p
                className="font-bold text-xs hover:cursor-pointer hover:text-[cyan]"
                onClick={() =>
                  setMoreDetails((prevMoreDetails) => !prevMoreDetails)
                }>
                ...Get more details
              </p>
              {moreDetails && (
                <div>
                  {weatherDetails.map((value, index) => {
                    return (
                      <p
                        key={index}
                        className=" h-auto md:text-4xl lg:text-5xl sm:text-2xl text-xl p-1">
                        {value}
                      </p>
                    );
                  })}
                </div>
              )}
              <p className=" h-auto w-auto md:text-3xl lg:text-4xl sm:text-2xl text-xl p-1">
                Date:{" "}
                {JSON.stringify(weather.location.localtime)
                  .split(" ")[0]
                  .split('"')}
              </p>
              <p className=" h-auto w-auto md:text-3xl lg:text-4xl sm:text-2xl text-xl p-1">
                Last updated:{" "}
                {JSON.stringify(weather.location.localtime)
                  .split(" ")[1]
                  .split('"')}
              </p>
              <p className=" h-auto w-auto md:text-3xl lg:text-4xl sm:text-2xl text-xl p-1"></p>
            </div>
          )}
        </div>

        <footer className="bottom-0 absolute hover:text-cyan-300 transition-colors duration-300 hover:cursor-pointer hover:animate-bounce">
          Powered by weatherapi.com
        </footer>
        <div className="flex absolute flex-col top-[70%] items-center">
          <h2
            onClick={() =>
              setForCustomCity((prevForCustomCity) => !prevForCustomCity)
            }
            className="hover:cursor-pointer">
            Get weather for another city:
          </h2>
          {forCustomCity && (
            <form onSubmit={getWeatherFromCity}>
              <input
                className="border-2 rounded-md px-2 text-black mt-[10%] py-1"
                placeholder="Enter city"
                ref={customCity}
                type="text"
              />
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
export default Weather;
