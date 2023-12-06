const init = setInterval(() => {
  if (window.TrackJS) {
    TrackJS.install({
      token: "abb73baafbd94b74878a59fc03e5ac1b",
    });
    clearInterval(init);
  }
}, 100);
