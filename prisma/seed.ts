async function main() {
  if (process.env.NODE_ENV === "production") {
    await import("./seed.prod");
  } else {
    await import("./seed.dev");
  }
}

main();
