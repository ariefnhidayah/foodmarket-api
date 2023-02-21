class ProfileImage {
  getInitialName(fullName) {
    const results = [];
    const wordArray = fullName.split(' ');

    wordArray.forEach((e, i) => {
      if (i < 2) {
        results.push(e);
      }
    });

    return results.join('+').toUpperCase();
  }

  getRandomColor() {
    const colors = [
      '08ab02',
      '00a1e1',
      'ab0202',
      '7f0084',
      '926900',
      'a70050',
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  generateImage(fullName) {
    const initialName = this.getInitialName(fullName)
    const color = this.getRandomColor()
    return `https://eu.ui-avatars.com/api/?background=${color}&color=fff&size=128&name=${initialName}`
  }
}

module.exports = ProfileImage