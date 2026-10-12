const display=document.getElementById('result');
function get_calc(btn) {
  if (btn.value==="AC") {
    display.value="";
    return;
  }
  else if (btn.value==="=") {
    if (display.value==="") {
      return;
    }
    try {
      const expression=display.value.replaceAll('×','*').replaceAll('÷','/');
      display.value=eval(expression); 
    } 
    catch (error) {
      display.value="Error";
    }
    return;
  }
  else if (display.value==="" || display.value==="Error") {
    display.value=btn.value;
  } 
  else {
    display.value=display.value+btn.value;
  }
}