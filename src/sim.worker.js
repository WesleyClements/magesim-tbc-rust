importScripts('./magesim.js');

onmessage = (event) => {
  const { data } = event;

  const parseTalentsLink = (str) => {
    if (str.match(/^[0-9-]+$/)) {
      return str;
    }

    const m = str.match(/tbc\.wowhead\.com.*mage\/([0-9-]+)/i);
    if (m) {
      return m[1];
    }

    return '---';
  };

  if (data.type === 'start') {
    fetch('./magesim.wasm', { cache: 'no-store' })
      .then((r) => r.arrayBuffer())
      .then((binary) => MageSim({ wasmBinary: binary }))
      .then((w) => w.ready)
      .then((m) => {
        const config = m.allocConfig();
        for (const key in data.config) {
          if (key.indexOf('_t') && Array.isArray(data.config[key])) {
            const v = new m.VectorDouble();
            for (let i = 0; i < data.config[key].length; i += 1) {
              if (typeof (data.config[key][i]) === 'number') {
                v.push_back(data.config[key][i]);
              } else {
                break;
              }
            }
            config[key] = v;
          } else if (typeof (config[key]) !== 'undefined') {
            config[key] = data.config[key];
          }
        }
        if (
          Object.prototype.hasOwnProperty.call(m.MainRotation.values, data.config.main_rotation)
        ) {
          config.main_rotation = m.MainRotation.values[data.config.main_rotation];
        }
        if (
          Object.prototype.hasOwnProperty.call(m.RegenRotation.values, data.config.regen_rotation)
        ) {
          config.regen_rotation = m.RegenRotation.values[data.config.regen_rotation];
        }
        if (
          Object.prototype.hasOwnProperty.call(m.Trinket.values, data.config.trinket1)
        ) {
          config.trinket1 = m.Trinket.values[data.config.trinket1];
        }
        if (
          Object.prototype.hasOwnProperty.call(m.Trinket.values, data.config.trinket2)
        ) {
          config.trinket2 = m.Trinket.values[data.config.trinket2];
        }
        if (
          Object.prototype.hasOwnProperty.call(m.MetaGem.values, data.config.meta_gem)
        ) {
          config.meta_gem = m.MetaGem.values[data.config.meta_gem];
        }
        if (
          Object.prototype.hasOwnProperty.call(m.Flask.values, data.config.flask)
        ) {
          config.flask = m.Flask.values[data.config.flask];
        }
        if (
          Object.prototype.hasOwnProperty.call(m.Elixir.values, data.config.battle_elixir)
        ) {
          config.battle_elixir = m.Elixir.values[data.config.battle_elixir];
        }
        if (
          Object.prototype.hasOwnProperty.call(m.Elixir.values, data.config.guardian_elixir)
        ) {
          config.guardian_elixir = m.Elixir.values[data.config.guardian_elixir];
        }
        if (
          Object.prototype.hasOwnProperty.call(m.WeaponOil.values, data.config.weapon_oil)
        ) {
          config.weapon_oil = m.WeaponOil.values[data.config.weapon_oil];
        }
        if (
          Object.prototype.hasOwnProperty.call(m.Food.values, data.config.food)
        ) {
          config.food = m.Food.values[data.config.food];
        }
        if (
          Object.prototype.hasOwnProperty.call(m.Drums.values, data.config.drums)
        ) {
          config.drums = m.Drums.values[data.config.drums];
        }
        if (
          Object.prototype.hasOwnProperty.call(m.Potion.values, data.config.potion)
        ) {
          config.potion = m.Potion.values[data.config.potion];
        }
        if (
          Object.prototype.hasOwnProperty.call(m.Potion.values, data.config.first_potion)
        ) {
          config.first_potion = m.Potion.values[data.config.first_potion];
        }
        if (
          Object.prototype.hasOwnProperty.call(m.Conjured.values, data.config.conjured)
        ) {
          config.conjured = m.Conjured.values[data.config.conjured];
        }

        const player = m.allocPlayer(config);
        const stats = JSON.parse(JSON.stringify(player.stats));
        for (const key in data.config.stats) {
          if (Object.prototype.hasOwnProperty.call(stats, key)) {
            stats[key] = data.config.stats[key];
          }
        }
        if (Object.prototype.hasOwnProperty.call(m.Race.values, data.config.race)) {
          player.race = m.Race.values[data.config.race];
        }
        player.setStats(stats);

        if (data.config.talents) {
          const talents = parseTalentsLink(data.config.talents);
          player.loadTalentsFromString(talents);
        }

        let result;
        if (data.iterations && data.iterations > 1) {
          result = m.runSimulations(config, player, data.iterations);
        } else {
          result = m.runSimulation(config, player);
        }

        if (result.log) {
          result.log = JSON.parse(result.log);
        }
        if (result.spells) {
          result.spells = JSON.parse(result.spells);
        }
        if (result.histogram) {
          result.histogram = JSON.parse(result.histogram);
        }
        if (result.stats) {
          result.stats = JSON.parse(result.stats);
        }

        postMessage({
          type: 'success',
          result,
        });
      })
      .catch((e) => console.error(e));
  }
};
