const $form = document.querySelector("[data-form]");
const $submitBtn = document.querySelector("[data-submit-btn]");

//Handle sign-up form submission
$form.addEventListener("submit", async (event) => {
  event.preventDefault();
  $submitBtn.setAttribute('disabled','');

  const formData = new FormData($form);

  if (formData.get('password') !== formData.get('confirm_password')) {
    $submitBtn.removeAttribute('disabled');
    return;
  }

 const response = await fetch(`${window.location.origin}/register`, {
    method: "POST",
    headers:{
        'Content-Type':'application/x-www-form-urlencoded'
    },
    body:new URLSearchParams(Object.fromEntries(formData.entries())).toString()
  });

  if(response.ok){
    return window.location = response.url;
  }
});
