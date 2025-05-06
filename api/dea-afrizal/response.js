const response = (status_code, data, message, res) => {
  res.status(status_code).json([
    {
      payload: data,
      message,
      metadata: {
        prev: "",
        next: "",
        current: "",
      },
    },
  ]);
};

module.exports = response;
