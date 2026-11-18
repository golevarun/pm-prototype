/* Buttons inside UI.menu, UI.modal and UI.drawer have their own handlers but no data-js,
   so proto.js would show "Not part of this prototype yet." after they run. Mark them first. */
document.addEventListener('click',function(e){
  var el=e.target.closest&&e.target.closest('.ui-pop a,.ui-pop button,.ui-ov a,.ui-ov button,.ui-dr-ov a,.ui-dr-ov button');
  if(el&&!el.hasAttribute('data-js'))el.setAttribute('data-js','');
},true);
