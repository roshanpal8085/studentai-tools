export const triggerDownloadAd = () => {
  // Check if script is already injected to avoid multiple injections
  if (!document.getElementById('adsterra-social-bar')) {
    const script = document.createElement('script');
    script.id = 'adsterra-social-bar';
    script.type = 'text/javascript';
    script.async = true;
    script.setAttribute('data-cfasync', 'false');
    script.src = 'https://bicea.org/14/74892b88365c72e56aef18906df8e25d';
    document.head.appendChild(script);
  }
};
