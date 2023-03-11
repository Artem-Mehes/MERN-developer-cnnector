export const createPayloadCreator =
  (apiRequest) =>
  async (data, { rejectWithValue }) => {
    try {
      const response = await apiRequest(data);
      return response.data;
    } catch (error) {
      if (error.response?.data?.errors) {
        return rejectWithValue(error.response.data.errors);
      } else {
        return rejectWithValue(error);
      }
    }
  };
