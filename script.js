const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
const values = [2, 3, 4, 5, 6, 7, 8, 9, 10, 'jack', 'queen', 'king', 'ace'];

class Card {
  constructor(suit, value) {
    this.suit = suit;
    this.value = value;
  }
}

class Deck {
  constructor() {
    this.deck = [];
  }

  createDeck(suits, values) {
    for (const suit of suits) {
      for (const value of values) {
        this.deck.push(new Card(suit, value));
      }
    }
    return this.deck;
  }

  shuffle() {
    let counter = this.deck.length,
      temp,
      i;

    while (counter) {
      i = Math.floor(Math.random() * counter--);
      temp = this.deck[counter];
      this.deck[counter] = this.deck[i];
      this.deck[i] = temp;
    }

    return this.deck;
  }

  deal(amount) {
    let hand = [];
    while (hand.length < amount) {
      hand.push(this.deck.pop());
    }
    return hand;
  }
}

let deck = new Deck(),
  currHand,
  prevHand,
  lastCard,
  deckLength = 52,
  points = 0,
  tries = 3;

const flipCard = document.querySelector('.flip-card'),
  cardFront = document.querySelector('.card-front'),
  buttons = document.querySelectorAll('button'),
  pointContainer = document.getElementById('points'),
  tryContainer = document.getElementById('tries'),
  cardsLeft = document.getElementById('cards-left');

buttons.forEach((button) => {
  button.addEventListener('click', () => {
    if (button.classList.contains('start-game')) {
      startGame(button);
    } else if (button.classList.contains('end-game')) {
      endGame(button);
    } else if (tries > 0) {
      cardGuess(button.textContent);
    }
  });
});

function pullCard() {
  const numbers = {
    jack: 11,
    queen: 12,
    king: 13,
    ace: 14,
  };
  const card = deck.deal(1);
  deckLength--;
  cardsLeft.textContent = deckLength;
  cardFront.style.background = `url(./cards/${card[0].value}_of_${card[0].suit}.png`;
  cardFront.style.backgroundSize = '100% 100%';

  const cardValue = numbers.hasOwnProperty(card[0].value)
    ? numbers[card[0].value]
    : card[0].value;
  console.log(cardValue);
  return cardValue;
}

function cardGuess(guess) {
  prevHand = currHand;
  currHand = pullCard();
  if (
    (guess === 'Lower' && currHand < prevHand) ||
    (guess === 'Higher' && currHand > prevHand) ||
    (guess === 'Even' && currHand === prevHand)
  ) {
    points++;
    pointContainer.textContent = points;
  } else {
    tries--;
    if (tries === 0) {
      tryContainer.textContent = 'You lost..';
      setTimeout(() => endGame(document.querySelector('button')), 1500);
    } else {
      tryContainer.textContent = tries;
    }
  }
  if (deckLength === 0) {
    tryContainer.textContent = 'You won!!!';
    setTimeout(() => endGame(document.querySelector('button')), 1500);
  }
}

function startGame(button) {
  deck.createDeck(suits, values);
  deck.shuffle();

  deckLength = 52;
  cardsLeft.textContent = deckLength;
  points = 0;
  pointContainer.textContent = points;
  tries = 3;
  tryContainer.textContent = tries;
  currHand = pullCard();
  flipCard.classList.add('do-flip');
  button.classList.remove('start-game');
  button.classList.add('end-game');
  button.textContent = 'End game';
  return currHand;
}

function endGame(button) {
  deck = new Deck();

  flipCard.classList.contains('do-flip')
    ? flipCard.classList.remove('do-flip')
    : '';
  button.classList.contains('end-game')
    ? button.classList.remove('end-game')
    : '';
  button.classList.add('start-game');
  button.textContent = 'Start game';

  console.clear();
}

endGame(document.querySelector('button'));
