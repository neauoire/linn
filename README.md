# linn

An implementation of the [LinnStrument keyboard layout](http://www.rogerlinndesign.com/linnstrument.html) for the **Monome 128**. This tiny console script will create a new virtual instrument called **Linn Monome** to use with your DAW. You can follow the discussion [here](https://llllllll.co/t/using-a-grid-as-linnstrument/23637).

<img src='https://raw.githubusercontent.com/neauoire/linn/master/PREVIEW.jpg' width='600'/>

## Setup

### Requirements

- install [git](https://hackernoon.com/install-git-on-mac-a884f0c9d32c), or check with `git -v`
- install [nodeJS](https://nodejs.org/en/), or check with `npm -v`
- install [monome drivers](https://monome.org/docs/setup/), and reboot.

### Install

- Open the terminal
- type `cd Documents`
- type `git clone https://github.com/neauoire/linn.git`
- type `cd linn`
- type `sudo npm install`
- type `node index`

### Whenever you want to use it

- type `cd Documents/linn`
- type `node index`

## Channel

By default, the linn monome will send to **Channel 0**, you can change channel by holding down the last key(bottom right), and pressing one of the 16 keys of the top row.

## Layout

```
F3   F3#  G3   G3#  A3   A3# B3   C4   C4#  D4   D4#  E4   F4  F4#  G4   G4#
C3   C3#  D3   D3#  E3   F3  F3#  G3   G3#  A3   A3#  B3   C4  C4#  D4   D4#
G2   G2#  A2   A2#  B2   C3  C3#  D3   D3#  E3   F3   F3#  G3  G3#  A3   A3#
D2   D2#  E2   F2   F2#  G2  G2#  A2   A2#  B2   C3   C3#  D3  D3#  E3   F3
A1   A1#  B1   C3   C2#  D2  D2#  E2   F2   F2#  G2   G2#  A2  A2#  B2   C3
E1   F1   F1#  G1   G1#  A1  A1#  B1   C2   C2#  D2   D2#  E2  F2   F2#  G2
B0   C1   C1#  D1   D1#  E1  F1   F1#  G1   G1#  A1   A1#  B1  C2   C2#  D2
F0#  G0   G0#  A0   A0#  B0  C1   C1#  D1   E1   F1   F1#  G1  G1#  A1   A1#
```

Enjoy!
