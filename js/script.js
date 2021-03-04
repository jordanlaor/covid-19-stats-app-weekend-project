function handleError (error) {
  console.log(error);
}

async fetchData(url) {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  }
  catch(error) {
    handleError(error);
  }
}