const array = {
  shuffle: (arr) => {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  },
  sameArray: (arr1, arr2) => {
    return (
    arr1.length === arr2.length &&
    arr1.every((val, i) => val === arr2[i])
  );
  }
}

const string = {
  fitText: (el, max=200, min=5) => {
    let size = max;
    el.style.fontSize = size + "px";

    // Turunkan ukuran sampai muat
    while ((el.scrollWidth > el.clientWidth || el.scrollHeight > el.clientHeight) && size > min) {
      size--;
      el.style.fontSize = size + "px";
    }
  },
  capitalizeWords: (text) => {
    return text.replace(/\b\w/g, function(char) {
      return char.toUpperCase();
    });
  },
  countMultiplicationFromString: (str) => str
      .toLowerCase()           // biar aman kalau pakai X besar
      .split('x')              // pisahkan berdasarkan "x"
      .map(s => parseFloat(s.trim())) // ubah ke angka
      .reduce((acc, val) => acc * val, 1) // kalikan semua
  
}

const fraction = {
  
}

const number = {
  isPrime(n) {
    if (n < 2) return false;
    for (let i = 2; i <= Math.sqrt(n); i++) {
      if (n % i === 0) return false;
    }
    return true;
  },

  getNextPrime(n) {
    let num = n + 1;
    while (!this.isPrime(num)) num++;
    return num;
  },

  getPrevPrime(n) {
    let num = n - 1;
    while (num > 1 && !this.isPrime(num)) num--;
    return num > 1 ? num : 2;
  },

  isAllPrimeAndUnique(arr) {
    const seen = new Set();

    for (let num of arr) {

      if (!number.isPrime(num)) return false;

      if (seen.has(num)) return false;

      seen.add(num);
    }

    // ✅ semua lolos
    return true;
  }
}

export { array, string, number }