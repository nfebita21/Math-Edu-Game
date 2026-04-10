const DrawerInitiator = {
  init({ button, drawer, content, menuItem }) {
    button.addEventListener('click', (event) => {
      this._toggleDrawer(event, drawer);
    });

    content.addEventListener('click', (event) => {
        this._closeDrawer(event, drawer);
    });

    


    for (let i = 0; i < menuItem.length; i++) {
      menuItem[i].addEventListener('click', (event) => {
        this._closeDrawer(event, drawer);
      });
    }
  },

  _toggleDrawer(event, drawer) {
    drawer.classList.toggle('open');

    // const dropdownProfile = document.getElementById('dropdownProfile');


    // event.stopPropagation();
  },

  _closeDrawer(event, drawer) {
    drawer.classList.remove('open');
  },
};

export default DrawerInitiator;