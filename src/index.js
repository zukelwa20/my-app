import React from 'react';
import './index.css';

class Board extends React.Component {
  renderSquare = (key, row, col, winner, value) => (
    <button className={`square${winner ? ' green' : ''}`}
            onClick={() => this.props.onClick(key, row, col)}
            key={key}>
      {value}
    </button>
  );

  render () {
    let newSquares = [], number = 0;
    const { squares } = this.props;
    const { winSquares } = squares;

    for (let i = 1; i <= 3; i++) {
      let row = [];

      for (let m = 1; m <= 3; m++) {
        let winner = winSquares && winSquares.indexOf(number) != -1 ? true : false;

        row.push(this.renderSquare(number, i, m, winner, squares[i]));
        number++;
      }

      newSquares.push(<div key={number} className="board-row">{row}</div>);
    }
    return <div>{newSquares}</div>;
  }
}

class App extends React.Component {

  constructor () {
    super();

    this.state = {
      history: [{ squares: Array(9).fill(null) }],
      xIsNext: true,
      stepNumber: 0,
      clicked: null,
      ascendingOrder: true
    };
  }

  handleClick (i, row, col) {
    let history = this.state.history;
    let current = history[history.length - 1];
    let squares = current.squares.slice();

    if (calculateWinner(squares) || squares[i]) {
      return;
    }

    squares[i] = this.state.xIsNext ? 'X' : 'O';

    this.setNextBoard(history, squares, row, col);
  }

  setNextBoard (history, squares, row, col) {
    this.setState({
      history: history.concat([
        {
          squares: squares,
          clicked: [row, col]
        }
      ]),
      xIsNext: !this.state.xIsNext,
      stepNumber: history.length
    });
  }

  jumpTo (i) {
    this.setState({
      stepNumber: i,
      xIsNext: (i % 2) ? false : true
    });
  }

  toggleOrder () {
    this.setState({
      ascendingOrder: !this.state.ascendingOrder
    });
  }

  render () {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    let status = 'Next player: ' + this.state.xIsNext ? 'X' : 'O';

    if (winner) {
      current.squares.winSquares = winner[3];
      status = 'Winner: ' + winner[0];
    }

    const moves = history.map((currentVal, index) => {

      let desc = 'Game start', row, col;

      if (index) {
        desc = 'Move: #' + index;
        row = '(' + this.state.history[index].clicked[0] + ', ';
        col = this.state.history[index].clicked[1] + ')';
      }

      let bold = (index === this.state.stepNumber ? 'bold' : '');

      return (
        <li key={index}>
          <a href="#" className={bold} onClick={() => this.jumpTo(index)}>
            {desc} {row} {col}
          </a>
        </li>
      );
    });

    //added a toggle button that allows to sort moves in either ascending or descending order.
    if (!this.state.ascendingOrder) {
      moves.sort(function (a, b) {
        return b.key - a.key;
      });
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board squares={current.squares} onClick={this.handleClick}/>
        </div>

        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
          <button onClick={this.toggleOrder}>Change order</button>
        </div>
      </div>
    );
  }
}

ReactDOM.render(<App/>, document.getElementById('root'));

function calculateWinner (squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];

    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return [squares[a], squares[b], squares[c], lines[i]];
    }
  }
}