import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';


// function Square(props) {
//   return (
//     <button className="square" onClick={props.onClick}>
//       {props.value}
//     </button>
//   );
// }


class Square extends React.Component {
  render() {
    let green = this.props.winner ? ' green' : '';
    return ( <button className = { "square" + green}

      onClick = {() => this.props.onClick()} >
      {this.props.value}
       </button>
    );
  }
}

class Board extends React.Component {
    renderSquare(i, row, col, win) {
      return <Square key = {i}
      winner = {win}
      value = {
        this.props.value[i]
    }
      onClick = {() => this.props.onClick(i, row, col)}/>;
    }
    render() {

      let squares = [];
      let number = 0;
      let row = [];
      let win = false;

      for (let i = 1; i <= 3; i++) {
        row = [];
        for (let m = 1; m <= 3; m++) {

          if (this.props.value.winSquares) {
            win = this.props.value.winSquares.indexOf(number) != -1 ? true : false;
          }

          row.push(this.renderSquare(number, i, j, win));
          number++;
        }
        squares.push( < div key = {
            number
          }
          className = "board-row" > {row}
          < /div>);
        }

        return ( <div> {
            squares
          } </div>
        );
      }
    }

    class Game extends React.Component {

      constructor() {
        super();
        this.state = {
          history: [{
            squares: Array(9).fill(null)
          }],
          xIsNext: true,
          stepNumber: 0,
          clicked: null,
          ascendingOrder: true
        };
      }

      handleClick(i, row, col) {
        let history = this.state.history;
        let current = history[history.length - 1];
        const squares = current.squares.slice();

        if(calculateWinner(squares) || squares[i]) {
          return;
        }

        squares[i] = this.state.xIsNext ? 'X' : 'O';

        this.setState({
          history: history.concat([{
            squares: squares,
            clicked: [row, col]
          }]),
          xIsNext: !this.state.xIsNext,
          stepNumber: history.length
        });
      }

      jumpTo(i) {
        this.setState({
          stepNumber: i,
          xIsNext: (i % 2) ? false : true
        });
      }

      toggleOrder() {
        this.setState({
          ascendingOrder: !this.state.ascendingOrder
        });
      }

      render() {

        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);

        let status;
        if (winner) {
          current.squares.winSquares = winner[3];
          status = 'Winner: ' + winner[0];
        } else {
          status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }

        const moves = history.map((currentVal, index) => {

          let desc = 'Game start';
          let row = null;
          let col = null;

          if (index) {
            desc = 'Move: #' + index;
            row = '(' + this.state.history[index].clicked[0] + ', ';
            col = this.state.history[index].clicked[1] + ')';
          }

          let bold = (index === this.state.stepNumber ? 'bold' : '');

          return (
            < key = {index}>
            <a href = "#" className = {bold}
            onClick = {() => this.jumpTo(index)}>
            {desc} {row} {col} </a></li>
          );
        })

        //added  a toggle button that allows to sort moves in either ascendind or descending oreder.
        if (!this.state.ascendingOrder) {
          moves.sort(function(a, b) {
            return b.key - a.key;
          });
        }

        return ( <
          div className = "game" >
          <
          div className = "game-board" >
          <
          Board value = {
            current.squares
          }
          onClick = {
            (i, row, col) => this.handleClick(i, row, col)
          }
          /> <
          /div> <
          div className = "game-info" >
          <
          div > {
            status
          } < /div> <
          ol > {
            moves
          } < /ol> <
          button onClick = {
            () => this.toggleOrder()
          } > Change order < /button> <
          /div> <
          /div>
        );
      }
    }

    // ========================================

    ReactDOM.render( <Game /> ,
      document.getElementById('root')
    );

    function calculateWinner(squares) {
      const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
      ];
      for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
          return [squares[a], squares[b], squares[c], lines[i]];
        }
      }
      return null;
    }
    // function showColor(square_1,square_2,square_3){
    //
    //
    // }
