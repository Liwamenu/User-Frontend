function chrome_responde() {
  chrome.runtime.onMessage.addListener(function (
    request,
    sender,
    sendResponse
  ) {
    // Process the request
    console.log(request);

    // Always call sendResponse(), even if with an empty response
    sendResponse({});
  });
}

chrome_responde();
