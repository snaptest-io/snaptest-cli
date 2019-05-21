module.exports = (error) => {
  if (error instanceof Error) {
    throw new Error(error.stack);
  } else {
    console.error(error);
  }
}