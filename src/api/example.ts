interface ExampleResponse {
  data: {
    success: boolean;
    message: string;
  };
}

const getExample = async (): Promise<ExampleResponse> => {
  return {
    data: {
      success: true,
      message: 'example',
    },
  };
};

export default getExample;