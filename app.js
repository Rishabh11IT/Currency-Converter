dropdowns = document.querySelectorAll(".dropdown select");
messageDetail = document.querySelector(".msg");
clickButton = document.querySelector("form button");
BASE_URL =
  "https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/";
fromURL = document.querySelector(".from select");
toURL = document.querySelector(".to select");
reverseButton = document.querySelector("#reverseCurrency");

for (const select of dropdowns) {
  for (let currencyCode in countryList) {
    let newElement = document.createElement("option");
    newElement.innerText = currencyCode;
    newElement.value = currencyCode;
    if (select.name === "from" && currencyCode === "USD") {
      newElement.selected = "selected";
    } else if (select.name === "to" && currencyCode === "INR") {
      newElement.selected = "selected";
    }
    select.append(newElement);
  }

  select.addEventListener("change", (env) => {
    updateFlag(env.target);
  });
}

reverseButton.addEventListener("click", async (evt) => {
  evt.preventDefault();
  let fromValue = fromURL.value;
  let toValue = toURL.value;
  fromURL.value = toValue;
  toURL.value = fromValue;
  updateFlag(fromURL);
  updateFlag(toURL);
});

const updateFlag = (env) => {
  let conCode = env.value;
  let countryCode = countryList[conCode];
  let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
  let img = env.parentElement.querySelector("img");
  let FullName = countryNameList[conCode];
  let title = img.setAttribute("title", `${FullName}`); 
  img.src = newSrc;
};

clickButton.addEventListener("click", async (evt) => {
  evt.preventDefault();
  await fetchDataRespone();
});

const fetchDataRespone = async () => {
  messageDetail.innerHTML = `<div class="loader"></div>`;
  let amt = document.querySelector(".amount input");
  let amtVul = amt.value;

  if (amtVul === "" || amtVul < 1) {
    amtVul = 1;
    amt.value = "1";
  }

  const API1_URL = `${BASE_URL}${fromURL.value.toLowerCase()}/${toURL.value.toLowerCase()}.json`;
  const API2_URL = `https://open.er-api.com/v6/latest/${fromURL.value}`;

  
  async function fetchData(apiUrl) {
    try {
      const response = await fetch(apiUrl);
      if (response.ok) {
        return await response.json();
      } else {
        console.error(
          `API call to ${apiUrl} failed with status code ${response.status}`
        );
        return null;
      }
    } catch (error) {
      console.error(`Error fetching data from ${apiUrl}: ${error.message}`);
      return null;
    }
  }

  
  const api1Data = await fetchData(API1_URL);
  const api2Data = await fetchData(API2_URL);

  if (api1Data) {
    
    console.log("API1 call was successful. Calling fetchdata method...");
    await fetchDataMethod(api1Data, toURL.value, amtVul);
  }
  if (api2Data) {
    
    console.log("API2 call was successful. Calling fetchdata method...");
    await fetchDataMethod(api2Data, toURL.value, amtVul);
  }
};

const fetchDataMethod = async (response, value, amtVul) => {
  let responseData = response.rates;
  if (responseData.hasOwnProperty(value)) {
    const result = responseData[value];
    let finalResult = Math.round(result * amtVul);
    console.log(finalResult);
    messageDetail.innerText = `${amtVul} ${fromURL.value} = ${finalResult} ${toURL.value}`;
  }
};

window.addEventListener("load", () => {
  fetchDataRespone();
});
