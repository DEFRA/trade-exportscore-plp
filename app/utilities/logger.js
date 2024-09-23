function log_error(file_name, method, error) {
  console.error(
    `Whilst running the '${method}' method in '${file_name}', the PLP application encounterd: ${error}`,
  );
}

module.exports = {
  log_error,
};
