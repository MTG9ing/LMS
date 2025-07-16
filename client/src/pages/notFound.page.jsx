function NotFound_Page() {
  return (
    <div className="px-4 md:text-center">
      <h1 className="text-4xl sm:text-5xl font-bold text-red-500">
        Not Found - 404
      </h1>
      <p className="mt-4 text-sm sm:text-base font-semibold text-muted-foreground">
        The page you are looking for does not exist.
        <br />
        Please check the{" "}
        <abbr
          title="Uniform Resource Locator, e.g., https://example.com"
          className="hover:underline cursor-help"
          tabIndex="0"
        >
          URL
        </abbr>{" "}
        and try again.
        <br />
        If the problem persists, please contact{" "}
        <a
          className="text-blue-500 hover:underline"
          href={`tel:${import.meta.env.VITE_SUPPORT_NUMBER}`}
          title={`Call ${import.meta.env.VITE_SUPPORT_NUMBER}`}
        >
          support
        </a>
        .
      </p>
    </div>
  );
}

export default NotFound_Page;
