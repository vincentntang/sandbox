var app = new Vue({
  el: "#app",
  data: {
    yourHealth: 100,
    monsterHealth: 100,
    start: true,
    logs: []
  },
  computed: {
    yourProgress: function() {
      return {
        width: this.yourHealth + "%"
      };
    },
    monsterProgress: function() {
      return {
        width: this.monsterHealth + "%"
      };
    }
  },
  methods: {
    // Commands
    attack: function() {
      // Player takes damage
      let dmgToPlayer = 5 + Math.floor(Math.random() * 10);
      this.yourHealth = this.yourHealth - dmgToPlayer;
      this.logs.push(`Monster hits player for ${dmgToPlayer}`);

      // Monster takes damage
      let dmgToMonster = 5 + Math.floor(Math.random() * 10);
      this.monsterHealth = this.monsterHealth - dmgToMonster;
      this.logs.push(`Player hits monster for ${dmgToMonster}`);
    },
    specialAttack: function() {
      // Player takes damage
      let dmgToPlayer = 5 + Math.floor(Math.random() * 20);
      this.yourHealth = this.yourHealth - dmgToPlayer;
      this.logs.push(`Monster hits player for ${dmgToPlayer}`);

      // Monster takes damage
      let dmgToMonster = 5 + Math.floor(Math.random() * 20);
      this.monsterHealth = this.monsterHealth - dmgToMonster;
      this.logs.push(`Player hits monster for ${dmgToMonster}`);
    },
    heal: function() {
      // Player takes heals
      let healToPlayer = 5 + Math.floor(Math.random() * 20);
      this.yourHealth = this.yourHealth + healToPlayer;
      this.logs.push(`Player heals himself for ${healToPlayer}`);

      // Monster takes damage
      let healToMonster = 5 + Math.floor(Math.random() * 20);
      this.monsterHealth = this.monsterHealth + healToMonster;
      this.logs.push(`Monster heals itself for ${healToMonster}`);
    },
    giveUp: function() {
      this.start = true;
    },
    // Init
    startGame: function() {
      this.yourHealth = 100;
      this.monsterHealth = 100;
      this.logs = [];
      this.start = false;
    }
  },

  watch: {
    yourHealth: function(value) {
      if (value < 0) {
        alert("you lose!");
        this.start = true;
      }
    },
    monsterHealth: function(value) {
      if (value < 0) {
        alert("you win!");
        this.start = true;
      }
    }
  }
});