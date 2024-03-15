document.addEventListener('DOMContentLoaded', function() {
    var personalToken = document.getElementById('personal_token');
    var copyButton = document.getElementById('copy');

    copyButton.addEventListener('click', function() {
      var token = personalToken.innerText;

      navigator.clipboard.writeText(token).then(function() {
        // Notification using CSS tooltip
        copyButton.setAttribute('data-tooltip', 'Personal token copied to clipboard!');
        copyButton.classList.add('tooltip');

        setTimeout(function() {
            copyButton.removeAttribute('data-tooltip');
            copyButton.classList.remove('tooltip');
        }, 1500);
        
        // Alternatively, you can use an alert box
        // alert('Copied to clipboard!');
      }).catch(function(error) {
        console.error('Copy to clipboard failed:', error);
      });
    });
  });