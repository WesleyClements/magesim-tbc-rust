<template>
  <div id="app">
    <a
      class="github"
      href="https://github.com/Cheesehyvel/magesim-tbc2"
      target="_blank"
    />

    <div
      v-if="fools_open == 1"
      class="fools"
    >
      <div class="inner">
        <div class="title">
          Buy premium
        </div>
        <div class="text mt-2">
          You currently have <b>{{ fools_remaining }}</b> free sim(s) remaining!<br>
          To get more sims sign up for our premium subscription of only <b>19.99€/month</b>!
        </div>
        <div
          class="btn large mt-2"
          @click="foolsBuy"
        >
          Buy premium 19.99€
        </div>
        <div />
        <div
          class="btn-text mt-1"
          @click="foolsClose"
        >
          No thanks, not right now
        </div>
      </div>
    </div>

    <div
      v-if="fools_open == 2"
      class="fools"
    >
      <div class="inner">
        <div class="title">
          Please buy premium
        </div>
        <div class="text mt-2">
          Come on man! I've got dust bunnies to feed!<br>
          For just 16.99€ I'll even toss in a free
          <a
            href="https://www.ikea.com/se/sv/images/products/hjalpreda-osthyvel-svart__0392887_PE560396_S4.JPG"
            target="_blank"
          >osthyvel</a>
        </div>
        <div
          class="btn mt-2"
          @click="foolsBuy"
        >
          Buy premium 14.99€
        </div>
        <div />
        <div
          class="btn-text mt-1"
          @click="foolsClose"
        >
          I don't care about you
        </div>
      </div>
    </div>

    <div
      v-if="fools_open == 3"
      class="fools2 notice"
    >
      <div class="inner">
        <div class="title">
          Premium or else
        </div>
        <div class="text mt-2">
          You know what? If you don't buy premium I'm just gonna mine Bitcoins in the background.
        </div>
        <div
          class="btn mt-2"
          @click="foolsBuy"
        >
          Buy premium 9.99€
        </div>
        <div />
        <div
          class="btn-text mt-1"
          @click="foolsClose"
        >
          Dude wtf, stop it
        </div>
      </div>
    </div>

    <div
      v-if="donation_open"
      class="notice"
      @click="donation_open = false"
    >
      <div class="inner">
        <div class="title">
          Thank you!
        </div>
        <div class="text mt-2">
          For your donation.
        </div>
      </div>
    </div>

    <div
      v-if="profile_status.open"
      class="profile-status notice"
      @click="profile_status.open = false"
    >
      <div class="inner">
        <div class="title">
          Profile loaded
        </div>
        <div class="checklist">
          <check-item :value="profile_status.items">
            Items
          </check-item>
          <check-item
            v-for="slot in profile_status.missing_items"
            :key="slot"
            :value="false"
          >
            {{ formatKey(slot) }}
          </check-item>
          <check-item :value="profile_status.config">
            Config
          </check-item>
        </div>
      </div>
    </div>

    <div class="wrapper">
      <div class="sidebar">
        <div class="actions">
          <div
            class="btn block"
            :class="[is_running ? 'disabled' : '']"
            @click="configToggle"
          >
            Config
          </div>
          <div
            class="btn block mt-n"
            :class="[is_running ? 'disabled' : '']"
            @click="runSingle"
          >
            Run
          </div>
          <div
            class="btn block mt-n"
            :class="[is_running ? 'disabled' : '']"
            @click="runMultiple"
          >
            Run {{ config.iterations }} times
          </div>
          <div
            class="btn block mt-n"
            :class="[is_running && !is_running_ep ? 'disabled' : '']"
            @click="runEP"
          >
            <template v-if="!is_running_ep">
              Run stat weights
            </template>
            <template v-else>
              Stop
            </template>
          </div>
        </div>
        <div
          v-if="final_stats"
          class="final-stats"
        >
          <table class="simple">
            <tbody>
              <tr>
                <td>Intellect</td>
                <td>{{ final_stats.intellect }}</td>
              </tr>
              <tr>
                <td>Spirit</td>
                <td>{{ final_stats.spirit }}</td>
              </tr>
              <tr>
                <td>Mp5</td>
                <td>{{ final_stats.mp5 }}</td>
              </tr>
              <tr>
                <td>Spell power</td>
                <td>{{ final_stats.spell_power }}</td>
              </tr>
              <tr v-if="final_stats.spell_power_arcane">
                <td>SP Arcane</td>
                <td>+{{ final_stats.spell_power_arcane }}</td>
              </tr>
              <tr v-if="final_stats.spell_power_frost">
                <td>SP Frost</td>
                <td>+{{ final_stats.spell_power_frost }}</td>
              </tr>
              <tr v-if="final_stats.spell_power_fire">
                <td>SP Fire</td>
                <td>+{{ final_stats.spell_power_fire }}</td>
              </tr>
              <tr>
                <td>Crit</td>
                <td>
                  <span>{{ $round(final_stats.crit, 2) }}%</span>
                  <tooltip position="r">
                    {{ final_stats.crit_rating }} crit rating
                  </tooltip>
                </td>
              </tr>
              <tr>
                <td>Hit</td>
                <td>
                  <span>{{ $round(final_stats.hit, 2) }}%</span>
                  <tooltip position="r">
                    {{ final_stats.hit_rating }} hit rating
                  </tooltip>
                </td>
              </tr>
              <tr>
                <td>Haste</td>
                <td>
                  <span>{{ $round(final_stats.haste, 2) }}%</span>
                  <tooltip position="r">
                    {{ final_stats.haste_rating }} haste rating
                  </tooltip>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div
          v-if="epCalc"
          class="ep-stats"
        >
          <div class="title">
            <span>Stat weights</span>
            <help>
              Stat weights are calculated by running {{ config.iterations }}
              iterations with +10 of each stat with the same RNG seed and
              comparing the dps gain.<br> Calculated stat weights are based on your config.
              Any changes to it or your items can change the weights.<br> The best way to
              find out if an item/gem/enchant is better is to equip it and run simulations.
            </help>
            <span
              v-if="epCalc && !is_running"
              class="link fr"
              @click="openJsonStats()"
            >
              json
            </span>
          </div>
          <select v-model="ep_weight">
            <option value="dps">
              DPS
            </option>
            <option value="int">
              Intellect (EP)
            </option>
            <option value="spi">
              Spirit (EP)
            </option>
            <option value="mp5">
              Mp5 (EP)
            </option>
            <option value="sp">
              Spell power (EP)
            </option>
            <option value="sp_arcane">
              SP Arcane (EP)
            </option>
            <option value="sp_frost">
              SP Frost (EP)
            </option>
            <option value="sp_fire">
              SP Fire (EP)
            </option>
            <option value="crit">
              Crit rating (EP)
            </option>
            <option value="hit">
              Hit rating (EP)
            </option>
            <option value="haste">
              Haste rating (EP)
            </option>
          </select>
          <table class="simple mt-1">
            <tbody>
              <tr @click="ep_weight = 'int'">
                <td>Intellect</td>
                <td>{{ $nullRound(epCalc.int, 2) }}</td>
              </tr>
              <tr @click="ep_weight = 'spi'">
                <td>Spirit</td>
                <td>{{ $nullRound(epCalc.spi, 2) }}</td>
              </tr>
              <tr @click="ep_weight = 'mp5'">
                <td>Mp5</td>
                <td>{{ $nullRound(epCalc.mp5, 2) }}</td>
              </tr>
              <tr @click="ep_weight = 'sp'">
                <td>Spell power</td>
                <td>{{ $nullRound(epCalc.sp, 2) }}</td>
              </tr>
              <tr @click="ep_weight = 'sp_arcane'">
                <td>SP Arcane</td>
                <td>{{ $nullRound(epCalc.sp_arcane, 2) }}</td>
              </tr>
              <tr @click="ep_weight = 'sp_frost'">
                <td>SP Frost</td>
                <td>{{ $nullRound(epCalc.sp_frost, 2) }}</td>
              </tr>
              <tr @click="ep_weight = 'sp_fire'">
                <td>SP Fire</td>
                <td>{{ $nullRound(epCalc.sp_fire, 2) }}</td>
              </tr>
              <tr @click="ep_weight = 'sp_crit'">
                <td>Crit rating</td>
                <td>{{ $nullRound(epCalc.crit, 2) }}</td>
              </tr>
              <tr @click="ep_weight = 'spt_hit'">
                <td>Hit rating</td>
                <td>{{ $nullRound(epCalc.hit, 2) }}</td>
              </tr>
              <tr @click="ep_weight = 'sp_haste'">
                <td>Haste rating</td>
                <td>{{ $nullRound(epCalc.haste, 2) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div
          v-else-if="result"
          class="result"
        >
          <template v-if="result.iterations">
            <div>DPS</div>
            <div>{{ $round(result.avg_dps, 2) }}</div>
            <div class="faded">
              {{ $round(result.min_dps, 2) }} - {{ $round(result.max_dps, 2) }}
            </div>
            <div class="mt-1" />
            <div
              v-if="result.stats.evocated.n"
              class="faded"
            >
              Evocated: {{ $round(result.stats.evocated.t, 1) }}s
              ({{ $round(result.stats.evocated.n / result.iterations * 100, 1) }}%)
            </div>
            <div
              v-if="result.stats.regened.n"
              class="faded"
            >
              Filler: {{ $round(result.stats.regened.t, 1) }}s
              ({{ $round(result.stats.regened.n / result.iterations * 100, 1) }}%)
            </div>
            <div
              v-if="result.stats.t_gcd_capped"
              class="faded"
            >
              Wasted haste: {{ $round(result.stats.t_gcd_capped, 2) }}s
              <help>Time spent gcd capped</help>
            </div>
            <div
              v-if="result.histogram"
              class="btn mt-1"
              @click="histogramToggle"
            >
              Histogram
            </div>
            <div
              class="btn mt-1"
              :class="[is_running ? 'disabled' : '']"
              @click="findAvg(result.avg_dps)"
            >
              Find avg fight
            </div>
            <div
              v-if="result.all_results"
              class="btn mt-1"
              @click="allResults"
            >
              Simulation data
            </div>
          </template>
          <template v-else>
            <div>DPS</div>
            <div>{{ $round(result.dps, 2) }}</div>
            <div>Damage: {{ result.dmg }}</div>
            <div class="mt-1" />
            <div
              v-if="result.evocated_at > 0"
              class="faded"
            >
              Evocated at: {{ $round(result.evocated_at, 1) }}
            </div>
            <div
              v-if="result.regened_at > 0"
              class="faded"
            >
              Filler at: {{ $round(result.regened_at, 1) }}
            </div>
            <div
              v-if="result.t_gcd_capped"
              class="faded"
            >
              Wasted haste: {{ $round(result.t_gcd_capped, 2) }}s
              <help>Time spent gcd capped</help>
            </div>
            <div
              v-if="result.log"
              class="btn mt-1"
              @click="logToggle"
            >
              Combat log
            </div>
            <div
              v-if="result.log"
              class="btn mt-1"
              @click="timelineToggle"
            >
              Timeline
            </div>
            <div
              v-if="result.spells"
              class="btn mt-1"
              @click="spellsToggle"
            >
              Spells
            </div>
          </template>
          <template v-if="!isMetaGemActive()">
            <div class="meta-warning mt-2">
              <span>
                <span class="material-icons">&#xe002;</span>
                <tooltip position="right">Meta gem requirements have not been met.</tooltip>
              </span>
            </div>
          </template>
        </div>
        <div class="donate">
          <a
            href="https://www.paypal.com/donate/?hosted_button_id=CU9RF4LCMW8W6"
            target="_blank"
          >
            Donate
          </a>
        </div>
      </div>
      <div class="main">
        <div class="gear">
          <div class="slots">
            <div
              v-for="slot in slots"
              class="slot"
              :class="[active_slot == slot ? 'active' : '']"
              @click="setActiveSlot(slot);"
            >
              {{ formatKey(slot) }}
            </div>
          </div>
          <div class="items">
            <div class="items-wrapper">
              <div class="top">
                <div class="form-item">
                  <select v-model="phase_filter">
                    <option :value="0">
                      - Filter by content phase -
                    </option>
                    <option :value="1">
                      Phase 1 - KZ, Gruul, Mag, Arena S1
                    </option>
                    <option :value="2">
                      Phase 2 - SSC, TK, Arena S2
                    </option>
                    <option :value="3">
                      Phase 3 - MH, BT, Arena S3
                    </option>
                    <option :value="4">
                      Phase 4 - Zul'Aman
                    </option>
                    <option :value="5">
                      Phase 5 - SWP, Arena S4
                    </option>
                  </select>
                </div>
                <div
                  class="btn"
                  :class="[!hasComparisons || is_running ? 'disabled' : '']"
                  @click="runComparison"
                >
                  Run item comparison
                </div>
                <div
                  class="btn"
                  @click="openEquiplist"
                >
                  Equipped items overview
                </div>
                <div
                  class="btn"
                  @click="openCustomItem"
                >
                  Add custom item
                </div>
              </div>

              <table class="mt-2">
                <thead>
                  <tr>
                    <th class="min">
                      <span
                        v-if="activeItems"
                        class="compare"
                        @click.stop="compareAll()"
                      >
                        <help icon="e915">Compare all items</help>
                      </span>
                    </th>
                    <th class="min" />
                    <th class="title">
                      <sort-link
                        v-model="item_sort"
                        name="title"
                      >
                        Name
                      </sort-link>
                    </th>
                    <th v-if="hasComparisons">
                      <sort-link
                        v-model="item_sort"
                        name="dps"
                        order="desc"
                      >
                        DPS
                      </sort-link>
                    </th>
                    <th>
                      <sort-link
                        v-model="item_sort"
                        name="phase"
                      >
                        Phase
                      </sort-link>
                    </th>
                    <th>
                      <sort-link
                        v-model="item_sort"
                        name="sockets"
                        order="desc"
                      >
                        Sockets
                      </sort-link>
                    </th>
                    <th>
                      <sort-link
                        v-model="item_sort"
                        name="sp"
                        order="desc"
                      >
                        Spell power
                      </sort-link>
                    </th>
                    <th>
                      <sort-link
                        v-model="item_sort"
                        name="crit"
                        order="desc"
                      >
                        Crit rating
                      </sort-link>
                    </th>
                    <th>
                      <sort-link
                        v-model="item_sort"
                        name="hit"
                        order="desc"
                      >
                        Hit rating
                      </sort-link>
                    </th>
                    <th>
                      <sort-link
                        v-model="item_sort"
                        name="haste"
                        order="desc"
                      >
                        Haste rating
                      </sort-link>
                    </th>
                    <th>
                      <sort-link
                        v-model="item_sort"
                        name="int"
                        order="desc"
                      >
                        Intellect
                      </sort-link>
                    </th>
                    <th>
                      <sort-link
                        v-model="item_sort"
                        name="spi"
                        order="desc"
                      >
                        Spirit
                      </sort-link>
                    </th>
                    <th>
                      <sort-link
                        v-model="item_sort"
                        name="mp5"
                        order="desc"
                      >
                        Mp5
                      </sort-link>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="item in activeItems"
                    :key="item.id"
                    class="item"
                    :class="[isEquipped(active_slot, item.id) ? 'active' : '']"
                    @click="equipToggle(active_slot, item)"
                  >
                    <td class="min">
                      <span
                        class="compare"
                        :class="[isComparing(item) ? 'active' : '']"
                        @click.stop="compareItem(item)"
                      >
                        <help icon="e915">Add to comparison</help>
                      </span>
                    </td>
                    <td class="min">
                      <span
                        v-if="$get(item, 'custom')"
                        class="delete"
                        @click.stop="deleteCustomItem(item)"
                      >
                        <help icon="e872">Delete custom item</help>
                      </span>
                    </td>
                    <td class="title">
                      <a
                        :href="itemUrl(item)"
                        :class="['quality-'+$get(item, 'q', 'epic')]"
                        target="_blank"
                        @click.prevent
                      >
                        {{ item.title }}
                      </a>
                      <span
                        class="link"
                        @click.stop="openItem(item)"
                      >
                        <span class="material-icons">
                          &#xe895;
                        </span>
                      </span>
                    </td>
                    <th v-if="hasComparisons">
                      {{ comparisonDps(item) }}
                    </th>
                    <th>{{ $get(item, "phase", 1) }}</th>
                    <td>
                      <template v-if="item.sockets">
                        <div
                          v-for="socket in item.sockets"
                          class="socket-color"
                          :class="['color-'+socket]"
                        />
                      </template>
                      <span
                        v-if="item.bonus"
                        class="ml-n"
                        :class="[hasSocketBonus(active_slot) ? 'socket-bonus' : '']"
                      >
                        +{{ formatStats(item.bonus) }}
                      </span>
                    </td>
                    <td>{{ formatSP(item) }}</td>
                    <td>{{ $get(item, "crit", "") }}</td>
                    <td>{{ $get(item, "hit", "") }}</td>
                    <td>{{ $get(item, "haste", "") }}</td>
                    <td>{{ $get(item, "int", "") }}</td>
                    <td>{{ $get(item, "spi", "") }}</td>
                    <td>{{ $get(item, "mp5", "") }}</td>
                  </tr>
                  <tr
                    v-for="(set, key) in items.quicksets"
                    v-if="active_slot == 'quicksets'"
                    class="item"
                    @click="quickset(set)"
                  >
                    <td />
                    <td />
                    <td>{{ set.title }}</td>
                    <td />
                    <td />
                    <td />
                    <td />
                    <td />
                    <td />
                    <td />
                  </tr>
                </tbody>
              </table>

              <table
                v-if="activeEnchants.length"
                class="mt-4"
              >
                <thead>
                  <tr>
                    <th>Enchant</th>
                    <th>Spell power</th>
                    <th>Crit rating</th>
                    <th>Hit rating</th>
                    <th>Intellect</th>
                    <th>Spirit</th>
                    <th>Mp5</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="item in activeEnchants"
                    :key="item.id"
                    class="item"
                    :class="[isEnchanted(active_slot, item.id) ? 'active' : '']"
                    @click="enchant(active_slot, item)"
                  >
                    <td>
                      <a
                        :href="spellUrl(item)"
                        :class="['quality-'+$get(item, 'q', 'uncommon')]"
                        target="_blank"
                        @click.stop
                      >
                        {{ item.title }}
                      </a>
                    </td>
                    <td>{{ formatSP(item) }}</td>
                    <td>{{ $get(item, "crit", "") }}</td>
                    <td>{{ $get(item, "hit", "") }}</td>
                    <td>{{ $get(item, "int", "") }}</td>
                    <td>{{ $get(item, "spi", "") }}</td>
                    <td>{{ $get(item, "mp5", "") }}</td>
                  </tr>
                </tbody>
              </table>

              <div
                v-if="activeSockets.length"
                class="sockets mt-4"
              >
                <div
                  v-for="(socket, index) in activeSockets"
                  class="socket"
                >
                  <div class="title">
                    <span>Socket {{ (index+1) }}</span>
                    <span
                      class="socket-color"
                      :class="['color-'+socket]"
                    />
                  </div>
                  <table>
                    <thead>
                      <tr>
                        <th>Gem</th>
                        <th>Stats</th>
                        <th v-if="socket == 'm'">
                          Requires
                        </th>
                        <th v-else>
                          Unique
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="gem in activeGems(index)"
                        :key="gem.id"
                        :class="[isSocketed(active_slot, gem.id, index) ? 'active' : '']"
                        @click="setSocket(active_slot, gem, index)"
                      >
                        <td>
                          <a
                            :href="itemUrl(gem)"
                            class="gem-color"
                            :class="['color-'+gem.color]"
                            target="_blank"
                            @click.stop
                          >
                            {{ gem.title }}
                          </a>
                        </td>
                        <td>{{ formatStats(gem) }}</td>
                        <td v-if="socket == 'm'">
                          <template v-if="gem.req">
                            <template v-if="metaGemHasCustomReq(gem)">
                              {{ gem.req }}
                            </template>
                            <template v-else>
                              <div
                                v-for="(n, c) in gem.req"
                                class="socket-text-color"
                                :class="['color-'+c]"
                              >
                                {{ n }}
                              </div>
                            </template>
                          </template>
                        </td>
                        <td v-else>
                          <template v-if="gem.unique">
                            Yes
                          </template>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          v-if="log_open"
          class="log"
        >
          <div class="log-wrapper">
            <div class="filter">
              <div class="form-item">
                <label><input
                  v-model="log_filter[2]"
                  type="checkbox"
                > <span>Show mana gain</span></label>
              </div>
              <div class="form-item">
                <label><input
                  v-model="log_filter[3]"
                  type="checkbox"
                > <span>Show buffs</span></label>
              </div>
              <div class="form-item">
                <label><input
                  v-model="log_filter[7]"
                  type="checkbox"
                > <span>Show GCD cap</span></label>
              </div>
            </div>
            <table>
              <thead>
                <th>Time</th>
                <th>Mana</th>
                <th>DPS</th>
                <th>Event</th>
              </thead>
              <tbody>
                <tr
                  v-for="log in result.log"
                  v-if="showLog(log)"
                  :class="['type-'+log.type]"
                >
                  <td>{{ formatTime(log.t) }}</td>
                  <td>{{ round(log.mana) }} ({{ round(log.mana_percent) }}%)</td>
                  <td>{{ (log.t ? round(log.dmg/log.t) : "0") }}</td>
                  <td>{{ log.text }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div
            class="close"
            @click="logToggle"
          >
            <span class="material-icons">
              &#xe5cd;
            </span>
          </div>
        </div>

        <div
          v-if="timeline_open"
          class="timel"
        >
          <timeline
            ref="timeline"
            :result="result"
          />
          <div
            class="close"
            @click="timelineToggle"
          >
            <span class="material-icons">
              &#xe5cd;
            </span>
          </div>
        </div>

        <div
          v-if="spells_open"
          class="spells"
        >
          <div class="spells-wrapper">
            <table>
              <thead>
                <th>Spell</th>
                <th>Casts</th>
                <th>Misses</th>
                <th>Hits</th>
                <th>Crits</th>
                <th>Damage</th>
                <th>Min dmg</th>
                <th>Avg dmg</th>
                <th>Max dmg</th>
              </thead>
              <tbody>
                <tr v-for="spell in result.spells">
                  <td>{{ spell.name }}</td>
                  <td>{{ spell.casts }} ({{ $round(spell.casts / numCasts * 100, 1) }}%)</td>
                  <td>{{ spell.misses }} ({{ $round(spell.misses/spell.casts*100, 2) }}%)</td>
                  <td>{{ spell.hits }}</td>
                  <td>{{ spell.crits }} ({{ $round(spell.crits/spell.casts*100, 2) }}%)</td>
                  <td>{{ $round(spell.dmg, 0) }} ({{ $round(spell.dmg / result.dmg * 100, 2) }}%)</td>
                  <td>{{ $round(spell.min_dmg, 0) }}</td>
                  <td>{{ $round(spell.dmg / (spell.casts - spell.misses), 0) }}</td>
                  <td>{{ $round(spell.max_dmg, 0) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div
            class="close"
            @click="spellsToggle"
          >
            <span class="material-icons">
              &#xe5cd;
            </span>
          </div>
        </div>

        <div
          v-if="histogram_open"
          class="histog"
        >
          <histogram :data="result.histogram" />
          <div
            class="close"
            @click="histogramToggle"
          >
            <span class="material-icons">
              &#xe5cd;
            </span>
          </div>
        </div>

        <div
          v-if="config_open"
          class="config"
        >
          <div class="fieldsets">
            <fieldset>
              <legend>General</legend>
              <div class="form-item">
                <span
                  class="btn-text"
                  @click="setSpec('arcane')"
                >Arcane</span>
                <span
                  class="btn-text"
                  @click="setSpec('fire')"
                >Fire</span>
                <span
                  class="btn-text"
                  @click="setSpec('frost')"
                >Frost</span>
              </div>
              <div class="form-item">
                <label>Race</label>
                <select v-model="config.race">
                  <option :value="races.RACE_BLOOD_ELF">
                    Blood elf
                  </option>
                  <option :value="races.RACE_DRAENEI">
                    Draenei
                  </option>
                  <option :value="races.RACE_GNOME">
                    Gnome
                  </option>
                  <option :value="races.RACE_HUMAN">
                    Human
                  </option>
                  <option :value="races.RACE_TROLL">
                    Troll
                  </option>
                  <option :value="races.RACE_UNDEAD">
                    Undead
                  </option>
                </select>
              </div>
              <div class="form-item">
                <label>
                  <span>Shattrath Faction</span>
                  <help>Controls the proc from Shattered Sun Pendant of Acumen necklace</help>
                </label>
                <select v-model="config.shatt_faction">
                  <option :value="factions.FACTION_ALDOR">
                    Aldor
                  </option>
                  <option :value="factions.FACTION_SCRYER">
                    Scryer
                  </option>
                </select>
              </div>
              <div class="form-item">
                <label>Talents (<a
                  :href="config.talents"
                  target="_blank"
                >link</a>)</label>
                <input
                  type="text"
                  :value="config.talents"
                  @input="onTalentsInput"
                >
              </div>
              <div class="form-item">
                <label>Main spell</label>
                <select v-model="config.main_rotation">
                  <option :value="main_rotations.MAIN_ROTATION_AB">
                    Arcane Blast
                  </option>
                  <option :value="main_rotations.MAIN_ROTATION_AE">
                    Arcane Explosion
                  </option>
                  <option :value="main_rotations.MAIN_ROTATION_AM">
                    Arcane Missiles
                  </option>
                  <option :value="main_rotations.MAIN_ROTATION_SC">
                    Scorch
                  </option>
                  <option :value="main_rotations.MAIN_ROTATION_FIB">
                    Fireball
                  </option>
                  <option :value="main_rotations.MAIN_ROTATION_FRB">
                    Frostbolt
                  </option>
                </select>
              </div>
              <template v-if="config.main_rotation == main_rotations.MAIN_ROTATION_AB">
                <div class="form-item">
                  <label>Filler spells</label>
                  <select v-model="config.regen_rotation">
                    <option :value="regen_rotations.REGEN_ROTATION_FB">
                      3xFrB
                    </option>
                    <option :value="regen_rotations.REGEN_ROTATION_FB11">
                      3xFrB (rank 11)
                    </option>
                    <option :value="regen_rotations.REGEN_ROTATION_AMFB">
                      1xAM, 1xFrB
                    </option>
                    <option :value="regen_rotations.REGEN_ROTATION_AMSC">
                      1xAM, 1xScorch
                    </option>
                    <option :value="regen_rotations.REGEN_ROTATION_AMAM">
                      2xAM
                    </option>
                    <option :value="regen_rotations.REGEN_ROTATION_SC">
                      5xScorch
                    </option>
                    <option :value="regen_rotations.REGEN_ROTATION_SCFB">
                      1xScorch, 2xFiB
                    </option>
                  </select>
                </div>
                <div class="form-item">
                  <label>Arcane Blasts between fillers</label>
                  <select v-model="config.regen_ab_count">
                    <option :value="1">
                      1x AB
                    </option>
                    <option :value="2">
                      2x AB
                    </option>
                    <option :value="3">
                      3x AB
                    </option>
                    <option :value="4">
                      4x AB
                    </option>
                  </select>
                </div>
                <div class="form-item">
                  <label>Regen rotation at mana %</label>
                  <input
                    v-model.number="config.regen_mana_at"
                    type="text"
                  >
                </div>
                <div class="form-item">
                  <label>
                    <span>Stop regen rotation at mana %</span>
                    <help>
                      Regen will always stop if it's possible to spam AB the rest of the fight
                    </help>
                  </label>
                  <input
                    v-model.number="config.regen_stop_at"
                    type="text"
                  >
                </div>
                <div class="form-item">
                  <label>
                    <span>Stop Arcane Blast at haste %</span>
                    <help>
                      This will cast frostbolt/fireball/arcane missiles
                      when above a certain haste %.<br> At 50% haste you
                      will reach GCD cap of 1 second.
                    </help>
                  </label>
                  <input
                    v-model.number="config.ab_haste_stop"
                    type="text"
                  >
                </div>
                <div class="form-item">
                  <label>
                    <span>Filler timings</span>
                    <help>Add specific times when you cast your filler rotation.</help>
                  </label>
                </div>
                <div
                  v-for="(s, i) in config.filler_start_t"
                  class="form-row dyn-timing"
                  :class="[i == 0 ? 'mt-0' : '']"
                >
                  <div class="form-item">
                    <input
                      v-model.number="config.filler_start_t[i]"
                      type="text"
                      placeholder="Start at"
                    >
                  </div>
                  <div class="form-item">
                    <input
                      v-model.number="config.filler_end_t[i]"
                      type="text"
                      placeholder="End at"
                    >
                  </div>
                  <div
                    class="delete"
                    @click="deleteFillerTiming(i)"
                  >
                    <span class="material-icons">&#xe872;</span>
                  </div>
                </div>
                <div
                  class="btn mt-n"
                  @click="addFillerTiming"
                >
                  Add filler timing
                </div>
              </template>
              <template v-if="canCream">
                <div class="form-item">
                  <label>
                    <input
                      v-model="config.cc_am_queue"
                      type="checkbox"
                    >
                    <span>Queue AM after clearcast</span>
                    <help>
                      Queue Arcane Missiles after a spell with clearcast active has been cast.<br>
                      Arcane Missiles will gain the bonus from Arcane Potency but will still
                      cost full mana.<br> This does not work if the cast time of the spell that
                      consumes CC is shorter than the GCD.<br> Example: AB -> CC proc -> AB -> AM
                    </help>
                  </label>
                </div>
                <div
                  v-if="config.cc_am_queue"
                  class="form-item"
                >
                  <label>
                    <input
                      v-model="config.cc_am_repeat"
                      type="checkbox"
                    >
                    <span>Repeat AM if it procs CC</span>
                  </label>
                </div>
              </template>
              <div class="form-item">
                <label><input
                  v-model="config.fire_blast_weave"
                  type="checkbox"
                > <span>Fire Blast weave</span></label>
              </div>
              <div class="form-item">
                <label>No. of targets</label>
                <input
                  v-model.number="config.targets"
                  type="text"
                >
              </div>
              <div class="form-item">
                <label>Fight duration (sec)</label>
                <input
                  v-model.number="config.duration"
                  type="text"
                >
              </div>
              <div class="form-item">
                <label>Duration +/- (sec)</label>
                <input
                  v-model.number="config.duration_variance"
                  type="text"
                >
              </div>
              <div class="form-item">
                <label>Number of sims</label>
                <input
                  v-model.number="config.iterations"
                  type="text"
                >
              </div>
              <div class="form-item">
                <label>
                  <span>RNG seed</span>
                  <help>
                    A number above 0 will give all runs the same random seed.<br>
                    All iterations in the same run will still have different seeds.<br>
                    This might be useful for certain analysis.
                  </help>
                </label>
                <input
                  v-model.number="config.rng_seed"
                  type="text"
                >
              </div>
              <div class="form-item">
                <label><input
                         v-model="config.gcd_unlocked"
                         type="checkbox"
                       >
                  <span>Unlock GCD</span>
                  <help>Enables the GCD to go below 1.0s with haste</help>
                </label>
              </div>
              <div class="form-item">
                <label><input
                         v-model="config.avg_spell_dmg"
                         type="checkbox"
                       >
                  <span>Use average spell damage</span>
                  <help>
                    This will eliminate the random damage from spells.<br>
                    This can be useful to verify calculations.
                  </help>
                </label>
              </div>
              <div class="form-item">
                <label><input
                         v-model="config.additional_data"
                         type="checkbox"
                       >
                  <span>Additional data</span>
                  <help>
                    This will save data about dps and duration for each simulation.<br>
                    This will use more memory and can cause performance issues with a
                    high number of sims.
                  </help>
                </label>
              </div>
            </fieldset>
            <fieldset>
              <legend>Debuffs</legend>
              <div class="form-item">
                <label><input
                  v-model="config.misery"
                  type="checkbox"
                > <span>Misery</span></label>
              </div>
              <div class="form-item">
                <label><input
                  v-model="config.curse_of_elements"
                  type="checkbox"
                > <span>Curse of Elements</span></label>
              </div>
              <div
                v-if="config.curse_of_elements"
                class="form-item"
              >
                <label><input
                         v-model="config.malediction"
                         type="checkbox"
                       >
                  <span>Malediction</span>
                  <help>3% extra damage from curse of elements</help>
                </label>
              </div>
              <div class="form-item">
                <label><input
                  v-model="config.judgement_of_the_crusader"
                  type="checkbox"
                > <span>Imp. Judgement of the Crusader</span></label>
              </div>
              <div class="form-item">
                <label><input
                  v-model="config.judgement_of_wisdom"
                  type="checkbox"
                > <span>Judgement of Wisdom</span></label>
              </div>
              <div
                v-if="hasTalent('imp_scorch')"
                class="form-item"
              >
                <label><input
                         v-model="config.maintain_fire_vulnerability"
                         type="checkbox"
                       >
                  <span>Keep up Fire Vulnerability</span>
                  <help>Imp. Scorch from you</help>
                </label>
              </div>
              <div class="form-item">
                <label><input
                         v-model="config.fire_vulnerability"
                         type="checkbox"
                       >
                  <span>Fire Vulnerability</span>
                  <help>Imp. Scorch from another mage</help>
                </label>
              </div>
              <div class="form-item">
                <label><input
                         v-model="config.winters_chill"
                         type="checkbox"
                       >
                  <span>Winter's Chill</span>
                  <help>Winter's Chill from another mage</help>
                </label>
              </div>
              <div class="form-item">
                <label><input
                  v-model="config.vampiric_touch"
                  type="checkbox"
                > <span>Vampiric Touch</span></label>
              </div>
              <div
                v-if="config.vampiric_touch"
                class="form-item"
              >
                <label>Vampiric Touch mana/sec</label>
                <input
                  v-model.number="config.vampiric_touch_regen"
                  type="text"
                >
              </div>
            </fieldset>
            <fieldset>
              <legend>Buffs</legend>
              <div class="form-item">
                <label><input
                  v-model="config.arcane_intellect"
                  type="checkbox"
                > <span>Arcane Intellect</span></label>
              </div>
              <div class="form-item">
                <label><input
                  v-model="config.mage_armor"
                  type="checkbox"
                  @input="dontStack($event, 'molten_armor')"
                > <span>Mage Armor</span></label>
              </div>
              <div class="form-item">
                <label><input
                  v-model="config.molten_armor"
                  type="checkbox"
                  @input="dontStack($event, 'mage_armor')"
                > <span>Molten Armor</span></label>
              </div>
              <div class="form-item">
                <label><input
                  v-model="config.divine_spirit"
                  type="checkbox"
                  @input="dontStack($event, 'scroll_of_spirit')"
                > <span>Divine Spirit</span></label>
              </div>
              <div
                v-if="config.divine_spirit"
                class="form-item"
              >
                <label><input
                  v-model="config.improved_divine_spirit"
                  type="checkbox"
                > <span>Imp. Divine Spirit</span></label>
              </div>
              <div class="form-item">
                <label><input
                  v-model="config.mark_of_the_wild"
                  type="checkbox"
                > <span>Mark of the Wild</span></label>
              </div>
              <div class="form-item">
                <label><input
                  v-model="config.totem_of_wrath"
                  type="checkbox"
                > <span>Totem of Wrath</span></label>
              </div>
              <div class="form-item">
                <label><input
                  v-model="config.wrath_of_air"
                  type="checkbox"
                > <span>Wrath of Air Totem</span></label>
              </div>
              <div class="form-item">
                <label><input
                  v-model="config.mana_spring"
                  type="checkbox"
                > <span>Mana Spring Totem</span></label>
              </div>
              <div
                v-if="config.mana_spring"
                class="form-item"
              >
                <label><input
                  v-model="config.improved_mana_spring"
                  type="checkbox"
                > <span>Imp. Mana Spring Totem</span></label>
              </div>
              <div class="form-item">
                <label><input
                  v-model="config.blessing_of_kings"
                  type="checkbox"
                > <span>Blessing of Kings</span></label>
              </div>
              <div class="form-item">
                <label><input
                  v-model="config.blessing_of_wisdom"
                  type="checkbox"
                > <span>Blessing of Wisdom</span></label>
              </div>
              <div class="form-item">
                <label><input
                  v-model="config.moonkin_aura"
                  type="checkbox"
                > <span>Moonkin Aura</span></label>
              </div>
              <div class="form-item">
                <label><input
                  v-model="config.imp_sanctity"
                  type="checkbox"
                > <span>Imp. Sanctity Aura</span></label>
              </div>
              <div
                v-if="faction == 'alliance'"
                class="form-item"
              >
                <label><input
                  v-model="config.inspiring_presence"
                  type="checkbox"
                > <span>Inspiring Presence (Draenei hit aura)</span></label>
              </div>
              <div class="form-item">
                <label><input
                         v-model="config.atiesh_mage"
                         type="checkbox"
                       >
                  <span>Mage Atiesh Aura</span>
                  <help>Another mage in your group has Atiesh</help>
                </label>
              </div>
              <div class="form-item">
                <label><input
                  v-model="config.atiesh_warlock"
                  type="checkbox"
                > <span>Warlock Atiesh Aura</span></label>
              </div>
              <div class="form-item">
                <label><input
                         v-model="config.eye_of_the_night"
                         type="checkbox"
                         :disabled="isEquipped('neck', items.ids.EYE_OF_THE_NIGHT)"
                       >
                  <span>Eye of the Night</span>
                  <help>This is a party-wide buff from a JC necklace (34 sp)</help>
                </label>
              </div>
              <div class="form-item">
                <label><input
                         v-model="config.chain_of_the_twilight_owl"
                         type="checkbox"
                         :disabled="isEquipped('neck', items.ids.CHAIN_OF_THE_TWILIGHT_OWL)"
                       >
                  <span>Chain of the Twilight Owl</span>
                  <help>This is a party-wide buff from a JC necklace (2 crit)</help>
                </label>
              </div>
              <div class="form-item">
                <label><input
                         v-model="config.jade_pendant_of_blasting"
                         type="checkbox"
                         :disabled="isEquipped('neck', items.ids.JADE_PENDANT_OF_BLASTING)"
                       >
                  <span>Jade Pendant of Blasting</span>
                  <help>This is a party-wide buff from a JC necklace (15 sp)</help>
                </label>
              </div>
              <div class="form-item">
                <label>Ferocious Inspirations</label>
                <input
                  v-model.number="config.ferocious_inspiration"
                  type="text"
                >
              </div>
            </fieldset>
            <fieldset>
              <legend>Consumes</legend>
              <div
                v-if="!config.battle_elixir && !config.guardian_elixir"
                class="form-item"
              >
                <label>Flask</label>
                <select v-model="config.flask">
                  <option :value="flasks.FLASK_NONE">
                    None
                  </option>
                  <option :value="flasks.FLASK_SUPREME_POWER">
                    Supreme Power (70 sp)
                  </option>
                  <option :value="flasks.FLASK_BLINDING_LIGHT">
                    Blinding Light (80 arc)
                  </option>
                  <option :value="flasks.FLASK_PURE_DEATH">
                    Pure Death (80 fire/frost)
                  </option>
                  <option :value="flasks.FLASK_DISTILLED_WISDOM">
                    Distilled Wisdom (65 int)
                  </option>
                  <option :value="flasks.FLASK_CHROMATIC_WONDER">
                    Chromatic Wonder (18 all stats)
                  </option>
                </select>
              </div>
              <div
                v-if="!config.flask"
                class="form-item"
              >
                <label>Battle Elixir</label>
                <select v-model="config.battle_elixir">
                  <option :value="elixirs.ELIXIR_NONE">
                    None
                  </option>
                  <option :value="elixirs.ELIXIR_ADEPTS">
                    Adept's Elixir (24 sp / 24 crit)
                  </option>
                  <option :value="elixirs.ELIXIR_GREATER_ARCANE">
                    Greater Arcane (35 sp)
                  </option>
                  <option :value="elixirs.ELIXIR_MAJOR_FIREPOWER">
                    Major Firepower (55 fire)
                  </option>
                  <option :value="elixirs.ELIXIR_MASTERY">
                    Elixir of Mastery (15 all stats)
                  </option>
                </select>
              </div>
              <div
                v-if="!config.flask"
                class="form-item"
              >
                <label>Guardian Elixir</label>
                <select v-model="config.guardian_elixir">
                  <option :value="elixirs.ELIXIR_NONE">
                    None
                  </option>
                  <option :value="elixirs.ELIXIR_DRAENIC_WISDOM">
                    Draenic Wisdom (30 int / 30 spi)
                  </option>
                  <option :value="elixirs.ELIXIR_MAJOR_MAGEBLOOD">
                    Major Mageblood (16 mp5)
                  </option>
                </select>
              </div>
              <div class="form-item">
                <label>Weapon oil</label>
                <select v-model="config.weapon_oil">
                  <option :value="weapon_oils.OIL_NONE">
                    None
                  </option>
                  <option :value="weapon_oils.OIL_BRILLIANT_WIZARD">
                    Brilliant Wizard Oil (36 sp / 14 crit)
                  </option>
                  <option :value="weapon_oils.OIL_SUPERIOR_WIZARD">
                    Superior Wizard Oil (42 sp)
                  </option>
                  <option :value="weapon_oils.OIL_BLESSED_WIZARD">
                    Blessed Wizard Oil (60 sp to undead)
                  </option>
                  <option :value="weapon_oils.OIL_SUPERIOR_MANA">
                    Superior Mana Oil (14 mp5)
                  </option>
                </select>
              </div>
              <div class="form-item">
                <label>Food</label>
                <select v-model="config.food">
                  <option :value="foods.FOOD_NONE">
                    None
                  </option>
                  <option :value="foods.FOOD_SPELL_POWER">
                    Blackened Basilisk (23 sp / 20 spi)
                  </option>
                  <option :value="foods.FOOD_SPELL_CRIT">
                    Skullfish Soup (20 crit / 20 spi)
                  </option>
                </select>
              </div>
              <div class="form-item">
                <label>Drums</label>
                <select v-model="config.drums">
                  <option :value="drums.DRUMS_NONE">
                    None
                  </option>
                  <option :value="drums.DRUMS_OF_BATTLE">
                    Drums of Battle (80 haste)
                  </option>
                  <option :value="drums.DRUMS_OF_WAR">
                    Drums of War (30 sp)
                  </option>
                  <option :value="drums.DRUMS_OF_RESTORATION">
                    Drums of Restoration (600 mana)
                  </option>
                </select>
              </div>
              <div
                v-if="config.drums"
                class="form-item"
              >
                <label><input
                         v-model="config.drums_friend"
                         type="checkbox"
                       >
                  <span>Drumming friend</span>
                  <help>Someone else in your party uses drums</help>
                </label>
              </div>
              <div class="form-item">
                <label>Potion</label>
                <select v-model="config.potion">
                  <option :value="potions.POTION_NONE">
                    None
                  </option>
                  <option :value="potions.POTION_MANA">
                    Mana potion
                  </option>
                  <option :value="potions.POTION_FEL_MANA">
                    Fel Mana potion
                  </option>
                  <option :value="potions.POTION_DESTRUCTION">
                    Destruction potion
                  </option>
                </select>
              </div>
              <div class="form-item">
                <label>
                  <span>First potion</span>
                  <help>Allows you to use a different potion for the first use</help>
                </label>
                <select v-model="config.first_potion">
                  <option :value="potions.POTION_NONE">
                    Same
                  </option>
                  <option :value="potions.POTION_MANA">
                    Mana potion
                  </option>
                  <option :value="potions.POTION_FEL_MANA">
                    Fel Mana potion
                  </option>
                  <option :value="potions.POTION_DESTRUCTION">
                    Destruction potion
                  </option>
                </select>
              </div>
              <div class="form-item">
                <label>Conjured</label>
                <select v-model="config.conjured">
                  <option :value="conjureds.CONJURED_NONE">
                    None
                  </option>
                  <option :value="conjureds.CONJURED_MANA_GEM">
                    Mana Emerald
                  </option>
                  <option :value="conjureds.CONJURED_FLAME_CAP">
                    Flame Cap
                  </option>
                </select>
              </div>
              <div class="form-item">
                <label>
                  <input
                    v-model="config.scroll_of_spirit"
                    type="checkbox"
                    @input="dontStack($event, ['divine_spirit', 'improved_divine_spirit'])"
                  >
                  <span>Scroll of Spirit V</span>
                  <help>Does not stack with Divine Spirit (30 spirit)</help>
                </label>
              </div>
              <div class="form-item">
                <label>
                  <input
                    v-model="config.kreegs"
                    type="checkbox"
                  >
                  <span>Kreeg's Stout Beatdown</span>
                  <help>Stacks with other food buffs (25 spirit, -5 int)</help>
                </label>
              </div>
              <div
                v-if="config.race == races.RACE_BLOOD_ELF"
                class="form-item"
              >
                <label>
                  <input
                    v-model="config.bloodthistle"
                    type="checkbox"
                  >
                  <span>Bloodthistle</span>
                  <help>10sp buff, only usable by Blood Elfs</help>
                </label>
              </div>
              <div class="form-item">
                <label>
                  <input
                    v-model="config.scourgebane"
                    type="checkbox"
                  >
                  <span>Scourgebane Infusion</span>
                  <help>15sp buff against undead</help>
                </label>
              </div>
            </fieldset>
            <fieldset>
              <legend>Cooldowns</legend>
              <template v-if="hasTalent('presence_of_mind')">
                <div class="form-item">
                  <label>
                    <span>Presence of Mind timings</span>
                    <timing-helper />
                  </label>
                </div>
                <div class="form-row mt-0">
                  <div
                    v-for="(a, i) in config.presence_of_mind_t"
                    class="form-item"
                  >
                    <input
                      v-model.number="config.presence_of_mind_t[i]"
                      type="text"
                    >
                  </div>
                </div>
              </template>
              <template v-if="hasTalent('arcane_power')">
                <div class="form-item">
                  <label>
                    <span>Arcane Power timings</span>
                    <timing-helper />
                  </label>
                </div>
                <div class="form-row mt-0">
                  <div
                    v-for="(a, i) in config.arcane_power_t"
                    class="form-item"
                  >
                    <input
                      v-model.number="config.arcane_power_t[i]"
                      type="text"
                    >
                  </div>
                </div>
              </template>
              <template v-if="hasTalent('icy_veins')">
                <div class="form-item">
                  <label>
                    <span>Icy Veins timings</span>
                    <timing-helper />
                  </label>
                </div>
                <div class="form-row mt-0">
                  <div
                    v-for="(a, i) in config.icy_veins_t"
                    class="form-item"
                  >
                    <input
                      v-model.number="config.icy_veins_t[i]"
                      type="text"
                    >
                  </div>
                </div>
              </template>
              <template v-if="hasTalent('cold_snap')">
                <div class="form-item">
                  <label>
                    <span>Cold Snap timings</span>
                    <timing-helper />
                  </label>
                </div>
                <div class="form-row mt-0">
                  <div
                    v-for="(a, i) in config.cold_snap_t"
                    class="form-item"
                  >
                    <input
                      v-model.number="config.cold_snap_t[i]"
                      type="text"
                    >
                  </div>
                </div>
              </template>
              <template v-if="hasTalent('combustion')">
                <div class="form-item">
                  <label>
                    <span>Combustion timings</span>
                    <timing-helper />
                  </label>
                </div>
                <div class="form-row mt-0">
                  <div
                    v-for="(a, i) in config.combustion_t"
                    class="form-item"
                  >
                    <input
                      v-model.number="config.combustion_t[i]"
                      type="text"
                    >
                  </div>
                </div>
              </template>
              <template v-if="config.race == races.RACE_TROLL">
                <div class="form-item">
                  <label>
                    <span>Berserking timings</span>
                    <timing-helper />
                  </label>
                </div>
                <div class="form-row mt-0">
                  <div
                    v-for="(a, i) in config.berserking_t"
                    class="form-item"
                  >
                    <input
                      v-model.number="config.berserking_t[i]"
                      type="text"
                    >
                  </div>
                </div>
              </template>
              <template v-if="showPotionT">
                <div class="form-item">
                  <label>
                    <span>Potion timings</span>
                    <timing-helper />
                  </label>
                </div>
                <div class="form-row mt-0">
                  <div
                    v-for="(a, i) in config.potion_t"
                    class="form-item"
                  >
                    <input
                      v-model.number="config.potion_t[i]"
                      type="text"
                    >
                  </div>
                </div>
              </template>
              <template v-if="config.conjured">
                <div class="form-item">
                  <label>
                    <span>Conjured timings</span>
                    <timing-helper />
                  </label>
                </div>
                <div class="form-row mt-0">
                  <div
                    v-for="(a, i) in config.conjured_t"
                    class="form-item"
                  >
                    <input
                      v-model.number="config.conjured_t[i]"
                      type="text"
                    >
                  </div>
                </div>
              </template>
              <template v-if="hasUseTrinket(1)">
                <div class="form-item">
                  <label>
                    <span>Trinket #1 timings</span>
                    <timing-helper />
                  </label>
                </div>
                <div class="form-row mt-0">
                  <div
                    v-for="(a, i) in config.trinket1_t"
                    class="form-item"
                  >
                    <input
                      v-model.number="config.trinket1_t[i]"
                      type="text"
                    >
                  </div>
                </div>
              </template>
              <template v-if="hasUseTrinket(2)">
                <div class="form-item">
                  <label>
                    <span>Trinket #2 timings</span>
                    <timing-helper />
                  </label>
                </div>
                <div class="form-row mt-0">
                  <div
                    v-for="(a, i) in config.trinket2_t"
                    class="form-item"
                  >
                    <input
                      v-model.number="config.trinket2_t[i]"
                      type="text"
                    >
                  </div>
                </div>
              </template>
              <template v-if="config.drums">
                <div class="form-item">
                  <label>
                    <span>Drums timings</span>
                    <timing-helper />
                  </label>
                </div>
                <div class="form-row mt-0">
                  <div
                    v-for="(a, i) in config.drums_t"
                    class="form-item"
                  >
                    <input
                      v-model.number="config.drums_t[i]"
                      type="text"
                    >
                  </div>
                </div>
              </template>
              <template>
                <div class="form-item">
                  <label>
                    <input
                      v-model="config.bloodlust"
                      type="checkbox"
                    >
                    <span>
                      Bloodlust
                      <span v-if="config.bloodlust">
                        timings
                        <timing-helper :nocd="true" />
                      </span>
                    </span>
                  </label>
                </div>
                <div
                  v-if="config.bloodlust"
                  class="form-row mt-0"
                >
                  <div
                    v-for="(a, i) in config.bloodlust_t"
                    class="form-item"
                  >
                    <input
                      v-model.number="config.bloodlust_t[i]"
                      type="text"
                    >
                  </div>
                </div>
              </template>
              <template>
                <div class="form-item">
                  <label>
                    <input
                      v-model="config.power_infusion"
                      type="checkbox"
                    >
                    <span>
                      Power Infusion
                      <span v-if="config.power_infusion">
                        timings
                        <timing-helper :nocd="true">Does not stack with Arcane Power</timing-helper>
                      </span>
                    </span>
                  </label>
                </div>
                <div
                  v-if="config.power_infusion"
                  class="form-row mt-0"
                >
                  <div
                    v-for="(a, i) in config.power_infusion_t"
                    class="form-item"
                  >
                    <input
                      v-model.number="config.power_infusion_t[i]"
                      type="text"
                    >
                  </div>
                </div>
              </template>
              <template>
                <div class="form-item">
                  <label>
                    <input
                      v-model="config.mana_tide"
                      type="checkbox"
                    >
                    <span>
                      Mana Tide
                      <template v-if="config.mana_tide">
                        timings
                        <timing-helper :nocd="true" />
                      </template>
                    </span>
                  </label>
                </div>
                <div
                  v-if="config.mana_tide"
                  class="form-row mt-0"
                >
                  <div
                    v-for="(a, i) in config.mana_tide_t"
                    class="form-item"
                  >
                    <input
                      v-model.number="config.mana_tide_t[i]"
                      type="text"
                    >
                  </div>
                </div>
              </template>
              <div
                v-if="faction == 'alliance'"
                class="form-item"
              >
                <label><input
                         v-model="config.symbol_of_hope"
                         type="checkbox"
                       >
                  <span>
                    Symbol of Hope
                    <template v-if="config.symbol_of_hope">at</template>
                  </span>
                  <help>
                    Draenei priest racial.<br> Setting this to 0 will automatically
                    cast it when mana is low.
                  </help>
                </label>
                <input
                  v-if="config.symbol_of_hope"
                  v-model.number="config.symbol_of_hope_at"
                  type="text"
                >
              </div>
              <div class="form-row">
                <div class="form-item">
                  <label>
                    <span>Evocation at</span>
                    <help>Setting this to 0 will evocate when mana is low</help>
                  </label>
                  <input
                    v-model.number="config.evocation_at"
                    type="text"
                  >
                </div>
                <div class="form-item">
                  <label>
                    <span>Cancel after n ticks</span>
                    <help>Setting this to 0 will not cancel evocation.</help>
                  </label>
                  <input
                    v-model.number="config.evo_ticks"
                    type="text"
                  >
                </div>
              </div>
              <div class="form-item">
                <label>Number of innervates</label>
                <input
                  v-model.number="config.innervate"
                  type="text"
                >
              </div>
              <template v-if="config.innervate > 0">
                <div class="form-item">
                  <label>
                    <span>Innervate timings</span>
                    <timing-helper :nocd="true">
                      Leaving empty will innervate when mana is low.
                    </timing-helper>
                  </label>
                </div>
                <div class="form-row mt-0">
                  <div
                    v-for="(a, i) in config.innervate_t"
                    v-if="i < config.innervate"
                    class="form-item"
                  >
                    <input
                      v-model.number="config.innervate_t[i]"
                      type="text"
                    >
                  </div>
                </div>
              </template>
            </fieldset>
            <fieldset class="profiles-fieldset">
              <legend>Profiles</legend>
              <div class="profiles">
                <div
                  v-for="(profile, index) in profiles"
                  :key="profile.id"
                  class="profile"
                >
                  <div
                    class="name"
                    @click="loadProfile(profile)"
                  >
                    {{ profile.name }}
                  </div>
                  <div class="actions">
                    <div
                      class="move move-up"
                      @click="moveProfile(index, -1)"
                    >
                      <span class="material-icons">&#xe316;</span>
                      <tooltip position="t">
                        Move up
                      </tooltip>
                    </div>
                    <div
                      class="move move-down"
                      @click="moveProfile(index, 1)"
                    >
                      <span class="material-icons">&#xe313;</span>
                      <tooltip position="t">
                        Move down
                      </tooltip>
                    </div>
                    <div
                      class="load-items"
                      @click="loadProfile(profile, 'items')"
                    >
                      <span class="material-icons">&#xe84e;</span>
                      <tooltip position="t">
                        Load items only
                      </tooltip>
                    </div>
                    <div
                      class="load-config"
                      @click="loadProfile(profile, 'config')"
                    >
                      <span class="material-icons">&#xe8b8;</span>
                      <tooltip position="t">
                        Load config only
                      </tooltip>
                    </div>
                    <div
                      class="save"
                      @click="saveProfile(profile)"
                    >
                      <span class="material-icons">&#xe161;</span>
                      <tooltip position="t">
                        Save profile
                      </tooltip>
                    </div>
                    <div
                      class="delete"
                      @click="deleteProfile(profile)"
                    >
                      <span class="material-icons">&#xe872;</span>
                      <tooltip position="t">
                        Delete profile
                      </tooltip>
                    </div>
                  </div>
                </div>
                <div class="new-profile mt-1">
                  <input
                    v-model="new_profile"
                    type="text"
                    @keydown.enter="newProfile()"
                  >
                  <div
                    class="btn"
                    :class="[new_profile ? '' : 'disabled']"
                    @click="newProfile()"
                  >
                    New profile
                    <tooltip position="r">
                      Save your items and config
                    </tooltip>
                  </div>
                </div>
                <div class="export-import mt-1">
                  <div
                    class="btn"
                    @click="openExport()"
                  >
                    Export
                  </div>
                  <div
                    class="btn ml-n"
                    @click="openImport()"
                  >
                    Import
                  </div>
                  <div
                    class="btn ml-n"
                    @click="openSeventyUpgradesImport()"
                  >
                    Import from 70up
                  </div>
                </div>
              </div>
            </fieldset>
          </div>
          <div
            class="close"
            @click="configToggle"
          >
            <span class="material-icons">
              &#xe5cd;
            </span>
          </div>
        </div>
      </div>

      <div
        v-if="json_stats_open"
        class="lightbox"
      >
        <div class="inner">
          <div class="title">
            Stats
          </div>
          <div class="form-item">
            <textarea
              ref="json_stats_input"
              v-model="json_stats_string"
            />
          </div>
          <div
            class="btn mt-2"
            @click="closeJsonStats"
          >
            Close
          </div>
          <div
            class="close"
            @click="closeJsonStats"
          >
            <span class="material-icons">
              &#xe5cd;
            </span>
          </div>
        </div>
      </div>

      <div
        v-if="export_profile.open"
        class="lightbox"
      >
        <div class="inner">
          <div class="title">
            Export
          </div>
          <div class="form-item">
            <textarea
              ref="export_input"
              v-model="export_profile.string"
            />
          </div>
          <div class="form-item">
            <label><input
              v-model="export_profile.items"
              type="checkbox"
              @input="updateExport"
            > <span>Include items</span></label>
            <label><input
              v-model="export_profile.config"
              type="checkbox"
              @input="updateExport"
            > <span>Include config</span></label>
          </div>
          <div
            class="btn mt-2"
            @click="closeExport"
          >
            Close
          </div>
          <div
            class="close"
            @click="closeExport"
          >
            <span class="material-icons">
              &#xe5cd;
            </span>
          </div>
        </div>
      </div>

      <div
        v-if="import_profile.open"
        class="lightbox"
      >
        <div class="inner">
          <div class="title">
            Import
          </div>
          <div class="form-item">
            <textarea
              ref="import_input"
              v-model="import_profile.string"
              @input="checkImportString"
            />
          </div>
          <div class="form-item">
            <label><input
              v-model="import_profile.items"
              type="checkbox"
              :disabled="!import_status.items"
            > <span>Include items</span></label>
            <label><input
              v-model="import_profile.config"
              type="checkbox"
              :disabled="!import_status.config"
            > <span>Include config</span></label>
          </div>
          <div
            class="btn mt-2"
            :class="[import_profile.string ? '' : 'disabled']"
            @click="doImport"
          >
            Import
          </div>
          <div
            class="close"
            @click="closeImport"
          >
            <span class="material-icons">
              &#xe5cd;
            </span>
          </div>
        </div>
      </div>

      <div
        v-if="import_seventy_upgrades.open"
        class="lightbox"
      >
        <div class="inner">
          <div class="title">
            Import from SeventyUpgrades.com
          </div>
          <div class="form-item">
            <textarea
              ref="import_seventy_upgrades_input"
              v-model="import_seventy_upgrades.string"
              @input="checkImportString"
            />
          </div>
          <div class="form-item">
            <label><input
              v-model="import_seventy_upgrades.items"
              type="checkbox"
            > <span>Include items</span></label>
            <label><input
              v-model="import_seventy_upgrades.config"
              type="checkbox"
            > <span>Include config</span></label>
          </div>
          <div
            class="btn mt-2"
            :class="[import_seventy_upgrades.string ? '' : 'disabled']"
            @click="doSeventyUpgradesImport"
          >
            Import
          </div>
          <div
            class="close"
            @click="closeSeventyUpgradesImport"
          >
            <span class="material-icons">
              &#xe5cd;
            </span>
          </div>
        </div>
      </div>

      <div
        v-if="equiplist_open"
        class="lightbox"
      >
        <div class="inner">
          <div class="title">
            Equipped items
          </div>
          <table>
            <thead>
              <tr>
                <th>Slot</th>
                <th>Item</th>
                <th>Enchant</th>
                <th>Gems</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(item_id, slot) in equipped"
                v-if="item_id"
                class="equipped-item"
              >
                <td>{{ formatKey(slot) }}</td>
                <td>
                  <a
                    :href="itemUrl(item_id)"
                    target="_blank"
                    :class="['quality-'+$get(getItem(slot, item_id), 'q', 'epic')]"
                  >
                    {{ getItem(slot, item_id).title }}
                  </a>
                </td>
                <td>
                  <template v-if="$get(enchants, slot)">
                    <a
                      :href="spellUrl(enchants[slot])"
                      target="_blank"
                      :class="['quality-'+$get(getEnchant(slot, enchants[slot]), 'q', 'uncommon')]"
                    >
                      {{ getEnchant(slot, enchants[slot]).title }}
                    </a>
                  </template>
                </td>
                <td>
                  <template v-if="gems.hasOwnProperty(slot)">
                    <template
                      v-for="(gem_id, index) in gems[slot]"
                      v-if="gem_id"
                    >
                      <span v-if="index > 0">,</span>
                      <a
                        :href="itemUrl(gem_id)"
                        target="_blank"
                        :class="['gem-color', 'color-'+getGem(gem_id).color]"
                      >
                        {{ getGem(gem_id).title }}
                      </a>
                    </template>
                  </template>
                </td>
              </tr>
            </tbody>
          </table>
          <div class="mt-2">
            <div
              class="btn"
              @click="copyEquiplist"
            >
              Copy
            </div>
            <div
              class="btn"
              @click="closeEquiplist"
            >
              Close
            </div>
          </div>
          <div
            class="close"
            @click="closeEquiplist"
          >
            <span class="material-icons">
              &#xe5cd;
            </span>
          </div>
        </div>
      </div>

      <div
        v-if="custom_item_open"
        class="lightbox small"
      >
        <div class="inner">
          <div class="title">
            Add custom item
          </div>
          <div class="description">
            Custom items will only be added for your browser.
          </div>
          <div class="form">
            <div class="form-item form-row">
              <label>
                ID
                <help>Leave empty to generate a random ID</help>
              </label>
              <input
                v-model.number="custom_item.id"
                type="number"
              >
            </div>
            <div class="form-item form-row">
              <label>Name</label>
              <input
                v-model="custom_item.title"
                type="text"
              >
            </div>
            <div class="form-item form-row">
              <label>Slot</label>
              <select v-model="custom_item.slot">
                <option :value="null">
                  - Choose -
                </option>
                <option
                  v-for="slot in itemSlots"
                  :value="slot"
                >
                  {{ formatKey(slot) }}
                </option>
              </select>
            </div>
            <div
              v-if="custom_item.slot == 'weapon'"
              class="form-item form-row"
            >
              <label>Twohanded</label>
              <div>
                <input
                  v-model="custom_item.twohand"
                  type="checkbox"
                >
              </div>
            </div>
            <div class="form-item form-row">
              <label>Quality</label>
              <select v-model="custom_item.q">
                <option value="epic">
                  Epic
                </option>
                <option value="rare">
                  Rare
                </option>
                <option value="uncommon">
                  Uncommon
                </option>
                <option value="common">
                  Common
                </option>
              </select>
            </div>
            <div class="form-item form-row">
              <label>Intellect</label>
              <input
                v-model.number="custom_item.int"
                type="number"
              >
            </div>
            <div class="form-item form-row">
              <label>Spirit</label>
              <input
                v-model.number="custom_item.spi"
                type="number"
              >
            </div>
            <div class="form-item form-row">
              <label>Spell Power</label>
              <input
                v-model.number="custom_item.sp"
                type="number"
              >
            </div>
            <div class="form-item form-row">
              <label>Spell Power (fire)</label>
              <input
                v-model.number="custom_item.sp_fire"
                type="number"
              >
            </div>
            <div class="form-item form-row">
              <label>Spell Power (frost)</label>
              <input
                v-model.number="custom_item.sp_frost"
                type="number"
              >
            </div>
            <div class="form-item form-row">
              <label>Spell Power (arcane)</label>
              <input
                v-model.number="custom_item.sp_arcane"
                type="number"
              >
            </div>
            <div class="form-item form-row">
              <label>Crit rating</label>
              <input
                v-model.number="custom_item.crit"
                type="number"
              >
            </div>
            <div class="form-item form-row">
              <label>Hit rating</label>
              <input
                v-model.number="custom_item.hit"
                type="number"
              >
            </div>
            <div class="form-item form-row">
              <label>Haste rating</label>
              <input
                v-model.number="custom_item.haste"
                type="number"
              >
            </div>
            <div class="form-item form-row">
              <label>Mp5</label>
              <input
                v-model.number="custom_item.mp5"
                type="number"
              >
            </div>
            <div class="form-item form-row">
              <label>Number of sockets</label>
              <input
                v-model.number="custom_item.sockets"
                type="number"
              >
            </div>
          </div>
          <div
            v-if="custom_item_error"
            class="mt-2 text-error"
          >
            {{ custom_item_error }}
          </div>
          <div class="mt-2">
            <div
              class="btn"
              @click="addCustomItem"
            >
              Save
            </div>
          </div>
          <div
            class="close"
            @click="closeCustomItem"
          >
            <span class="material-icons">
              &#xe5cd;
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash';
import { SimulationWorker, SimulationWorkers } from './simulation';
import items from './items';
import constants from './constants';

export default {

  data() {
    const defaultConfig = {
      iterations: 30000,
      race: 5,
      shatt_faction: 0,

      duration: 180,
      duration_variance: 0,
      rng_seed: 0,
      gcd_unlocked: false,
      avg_spell_dmg: false,
      additional_data: false,
      targets: 1,

      misery: true,
      curse_of_elements: true,
      malediction: false,
      judgement_of_the_crusader: false,
      judgement_of_wisdom: true,
      vampiric_touch: true,
      vampiric_touch_regen: 40,

      totem_of_wrath: true,
      wrath_of_air: true,
      mana_spring: true,
      improved_mana_spring: false,
      arcane_intellect: true,
      divine_spirit: true,
      improved_divine_spirit: false,
      blessing_of_kings: true,
      blessing_of_wisdom: true,
      mark_of_the_wild: true,
      moonkin_aura: false,
      mage_armor: true,
      molten_armor: false,
      inspiring_presence: false,
      fire_vulnerability: false,
      maintain_fire_vulnerability: false,
      winters_chill: false,
      imp_sanctity: false,
      ferocious_inspiration: 0,

      food: 0,
      flask: 0,
      battle_elixir: 0,
      guardian_elixir: 0,
      weapon_oil: 0,
      drums: 0,
      drums_friend: false,
      potion: 22832,
      first_potion: 0,
      conjured: 22044,
      atiesh_mage: false,
      atiesh_warlock: false,
      eye_of_the_night: false,
      chain_of_the_twilight_owl: false,
      jade_pendant_of_blasting: false,
      scroll_of_spirit: false,
      kreegs: false,
      bloodthistle: false,
      scourgebane: false,

      tirisfal_2set: true,
      tirisfal_4set: true,
      tempest_2set: false,
      tempest_4set: false,
      spellfire_set: false,
      spellstrike_set: false,
      eternal_sage: false,
      wrath_of_cenarius: false,
      blade_of_wizardry: false,
      robe_elder_scribes: false,
      blade_of_eternal_darkness: false,
      sunwell_neck_aldor: false,
      sunwell_neck_scryer: false,
      mana_etched_4set: false,
      meta_gem: 0,
      trinket1: 0,
      trinket2: 0,

      innervate: 0,
      mana_tide: true,
      bloodlust: true,
      power_infusion: false,
      symbol_of_hope: false,

      main_rotation: 0,
      regen_rotation: 0,
      regen_mana_at: 20,
      regen_stop_at: 30,
      regen_ab_count: 3,
      ab_haste_stop: 0,
      fire_blast_weave: false,

      cc_am_queue: false,
      cc_am_repeat: false,

      bis_ashtongue: false,

      trinket1_t: Array(4),
      trinket2_t: Array(4),
      arcane_power_t: Array(4),
      presence_of_mind_t: Array(4),
      icy_veins_t: Array(4),
      cold_snap_t: Array(4),
      combustion_t: Array(4),
      berserking_t: Array(4),
      mana_tide_t: Array(4),
      bloodlust_t: Array(4),
      power_infusion_t: Array(4),
      drums_t: Array(4),
      innervate_t: Array(4),
      potion_t: Array(4),
      conjured_t: Array(4),
      filler_start_t: [],
      filler_end_t: [],

      symbol_of_hope_at: 0,
      evocation_at: 0,
      evo_ticks: 0,

      talents: 'https://tbc.wowhead.com/talent-calc/mage/2500250300030150330125--053500031003001',

      stats: {
        intellect: 465,
        spirit: 285,
        mp5: 0,
        crit: 20,
        hit: 0,
        haste: 0,
        spell_power: 1000,
        spell_power_arcane: 50,
        spell_power_frost: 0,
        spell_power_fire: 0,
        crit_rating: 0,
        hit_rating: 0,
        haste_rating: 0,
      },

      tooltips: false,
    };

    const data = {
      ...constants,
      fools_open: 0,
      fools_remaining: 3,
      donation_open: false,
      items,
      equipped: {},
      enchants: {},
      gems: {},
      item_gems: {},
      item_comparison: [],
      item_off_hand: null,
      item_sort: {
        name: null,
        order: null,
      },
      profiles: [],
      active_slot: 'weapon',
      new_profile: null,
      import_profile: {
        open: false,
        string: null,
        items: true,
        config: true,
      },
      export_profile: {
        open: false,
        string: null,
        items: true,
        config: true,
      },
      import_status: {
        items: true,
        config: true,
      },
      profile_status: {
        open: false,
        timeout: null,
        items: true,
        missing_items: [],
        config: true,
      },
      import_seventy_upgrades: {
        open: false,
        string: null,
        items: true,
        config: false,
      },
      custom_item: {
        id: null,
        title: null,
        slot: null,
        q: 'rare',
        sockets: null,
        int: null,
        spi: null,
        sp: null,
        sp_fire: null,
        sp_arcane: null,
        sp_frost: null,
        crit: null,
        hit: null,
        haste: null,
        mp5: null,
        twohand: false,
      },
      custom_item_open: false,
      custom_item_error: null,
      equiplist_open: false,
      equiplist_string: null,
      final_stats: null,
      result: null,
      ep_result: null,
      ep_weight: 'dps',
      is_running: false,
      is_running_ep: false,
      config_open: false,
      log_open: false,
      timeline_open: false,
      spells_open: false,
      histogram_open: false,
      json_stats_open: false,
      json_stats_string: null,
      item_source: 'wowhead',
      phase_filter: 0,
      log_filter: {
        0: true,
        1: true,
        2: false,
        3: true,
        4: true,
        5: true,
        6: true,
        7: true,
      },
      default_config: defaultConfig,
      config: _.cloneDeep(defaultConfig),
    };

    const slots = [
      'weapon', 'off_hand', 'ranged',
      'head', 'neck', 'shoulder', 'back', 'chest', 'wrist',
      'hands', 'waist', 'legs', 'feet',
      'finger1', 'finger2', 'trinket1', 'trinket2',
    ];

    for (const slot of slots) {
      data.equipped[slot] = null;
      data.enchants[slot] = null;
      data.gems[slot] = [null, null, null];
    }

    data.slots = [...slots, 'quicksets'];

    return data;
  },

  computed: {
    foolsActive() {
      const d = new Date();
      return d.getMonth() === 3 && d.getDate() === 1;
    },

    spec() {
      if (this.config.main_rotation <= this.main_rotations.MAIN_ROTATION_AM) {
        return 'arcane';
      }
      if (this.config.main_rotation <= this.main_rotations.MAIN_ROTATION_FIB) {
        return 'fire';
      }
      if (this.config.main_rotation <= this.main_rotations.MAIN_ROTATION_FRB) {
        return 'frost';
      }
      return null;
    },

    canCream() {
      return this.hasTalent('clearcast')
                    && this.config.main_rotation !== this.main_rotations.MAIN_ROTATION_AM
                    && this.config.main_rotation !== this.main_rotations.MAIN_ROTATION_AE;
    },

    faction() {
      const alliance = [
        this.races.RACE_GNOME,
        this.races.RACE_HUMAN,
        this.races.RACE_DRAENEI,
      ];

      if (alliance.indexOf(this.config.race) !== -1) {
        return 'alliance';
      }
      return 'horde';
    },

    activeItems() {
      const slot = this.equipSlotToItemSlot(this.active_slot);

      let itemsForSlot = this.items.equip[slot];

      if (!itemsForSlot) {
        return [];
      }

      if (this.phase_filter) {
        itemsForSlot = itemsForSlot.filter((item) => _.get(item, 'phase', 1) <= this.phase_filter);
      }

      return this.sort(itemsForSlot, this.item_sort);
    },

    activeEnchants() {
      const slot = this.equipSlotToEnchantSlot(this.active_slot);

      if (!Object.prototype.hasOwnProperty.call(this.items.enchants, slot)) {
        return [];
      }

      return this.items.enchants[slot];
    },

    activeSockets() {
      const item = this.equippedItem(this.active_slot);
      return item && item.sockets ? item.sockets : [];
    },

    hasComparisons() {
      return this.item_comparison.length > 1;
    },

    itemSlots() {
      return _.keys(this.items.equip);
    },

    numCasts() {
      if (!this.result || !this.result.spells) {
        return 0;
      }
      return _.sumBy(this.result.spells, 'casts');
    },

    epCalc() {
      if (!this.ep_result) {
        return null;
      }

      const ep = {
        int: null,
        spi: null,
        mp5: null,
        sp: null,
        sp_arcane: null,
        sp_frost: null,
        sp_fire: null,
        crit: null,
        hit: null,
        haste: null,
      };

      if (!this.ep_result.base) {
        return ep;
      }

      if (this.ep_weight === 'dps') {
        for (const stat in ep) {
          if (this.ep_result[stat]) {
            ep[stat] = (this.ep_result[stat] - this.ep_result.base) / 10;
          }
        }
      } else {
        if (_.get(this.ep_result, this.ep_weight, 0) - this.ep_result.base < 0.1) {
          return ep;
        }

        for (const stat in ep) {
          if (this.ep_result[stat]) {
            if (stat === this.ep_weight) {
              ep[stat] = 1;
            } else {
              ep[stat] = (this.ep_result[stat] - this.ep_result.base)
                / (this.ep_result[this.ep_weight] - this.ep_result.base);
            }
          }
        }
      }

      return ep;
    },

    showPotionT() {
      return (
        this.config.potion
        && this.config.potion !== constants.potions.POTION_MANA
        && this.config.potion !== constants.potions.POTION_FEL_MANA
      ) || (
        this.config.first_potion
        && this.config.first_potion !== constants.potions.POTION_MANA
        && this.config.first_potion !== constants.potions.POTION_FEL_MANA
      );
    },
  },
  mounted() {
    this.loadCustomItems();
    this.loadConfig();
    this.loadGear();
    this.loadProfiles();
    this.finalStats();

    this.checkDonation();
  },

  methods: {
    sort(itemsToSort, sorting) {
      if (!sorting || !sorting.name) {
        return itemsToSort;
      }

      let type = null;
      for (let i = 0; i < itemsToSort.length; i += 1) {
        const value = _.get(itemsToSort[i], sorting.name, null);
        if (value !== null) {
          type = typeof (value);
          if (type === 'object') {
            if (_.isArray(value)) {
              type = 'array';
            } else {
              continue;
            }
          }
          break;
        }
      }

      if (sorting.name === 'dps') {
        type = 'number';
      }

      if (type === null) {
        return itemsToSort;
      }

      const self = this;

      return itemsToSort.sort((a, b) => {
        let av = _.get(a, sorting.name, null);
        let bv = _.get(b, sorting.name, null);

        if (sorting.name === 'phase') {
          if (!av) {
            av = 1;
          }
          if (!bv) {
            bv = 1;
          }
        }

        if (sorting.name === 'sp') {
          av = Math.max(_.get(a, 'sp', 0), _.get(a, 'sp_fire', 0), _.get(a, 'sp_frost', 0), _.get(a, 'sp_arcane', 0));
          bv = Math.max(_.get(b, 'sp', 0), _.get(b, 'sp_fire', 0), _.get(b, 'sp_frost', 0), _.get(b, 'sp_arcane', 0));
        }

        if (sorting.name === 'dps') {
          av = _.get(_.find(self.item_comparison, { id: a.id }), 'dps', 0);
          bv = _.get(_.find(self.item_comparison, { id: b.id }), 'dps', 0);
        }

        let result = 0;
        if (type === 'string') {
          try {
            av = av.toString();
          } catch (e) {
            av = '';
          }
          try {
            bv = bv.toString();
          } catch (e) {
            bv = '';
          }
          result = av.localeCompare(bv);
        } else if (type === 'number') {
          av = parseFloat(av);
          bv = parseFloat(bv);
          if (Number.isNaN(av)) {
            av = 0;
          }
          if (Number.isNaN(bv)) {
            bv = 0;
          }
          result = av - bv;
        } else if (type === 'array') {
          av = _.get(av, 'length', 0);
          bv = _.get(bv, 'length', 0);
          result = av - bv;
        }

        if (sorting.order === 'desc' && result !== 0) {
          result = result < 0 ? 1 : -1;
        }

        return result;
      });
    },

    foolsBuy() {
      window.location.href = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
    },

    foolsClose() {
      this.fools_open = (this.fools_open + 1) % 4;
    },

    foolsOpen() {
      if (!this.foolsActive || !this.fools_remaining) {
        return;
      }
      this.fools_remaining = Math.max(this.fools_remaining - 1, 0);
      this.fools_open = 1;
    },

    checkDonation() {
      if (window.location.hash === '#donation') {
        window.location.hash = '';
        this.donation_open = true;
      }
    },

    runMultiple() {
      const self = this;
      const sim = new SimulationWorkers(this.config.iterations, (result) => {
        self.is_running = false;
        self.result = result;
        self.foolsOpen();
      }, (error) => {
        self.is_running = false;
        console.error(error);
      });

      this.timeline_open = false;
      this.spells_open = false;
      this.log_open = false;
      this.ep_result = null;
      this.prepare();
      this.is_running = true;
      sim.start(this.config);
    },

    runSingle() {
      const self = this;
      const sim = new SimulationWorker((result) => {
        self.is_running = false;
        self.result = result;
        self.foolsOpen();
      }, (error) => {
        self.is_running = false;
        console.error(error);
      });

      this.histogram_open = false;
      this.ep_result = null;
      this.prepare();
      this.is_running = true;
      sim.start(this.config);
    },

    async findAvg(avg) {
      this.histogram_open = false;
      this.ep_result = null;
      this.prepare();
      this.is_running = true;

      let result;
      while (true) {
        result = await this.runAvg();
        if (Math.abs(result.dps - avg) <= avg * 0.005) {
          this.is_running = false;
          this.result = result;
          break;
        }
      }
    },

    async runAvg() {
      const self = this;

      return new Promise((resolve) => {
        const sim = new SimulationWorker(
          (result) => {
            resolve(result);
          },
          (error) => {
            self.is_running = false;
            console.error(error);
          },
        );

        self.is_running = true;
        sim.start(self.config);
      });
    },

    async runStat(stat, value, rngSeed) {
      const self = this;

      const addStats = (config, stats) => {
        stats = _.merge({
          int: 0,
          spi: 0,
          mp5: 0,
          crit: 0,
          hit: 0,
          sp: 0,
          haste: 0,
          sp_arcane: 0,
          sp_frost: 0,
          sp_fire: 0,
        }, stats);

        config.stats.intellect += stats.int;
        config.stats.spirit += stats.spi;
        config.stats.mp5 += stats.mp5;
        config.stats.spell_power += stats.sp;
        config.stats.spell_power_arcane += stats.sp_arcane;
        config.stats.spell_power_frost += stats.sp_frost;
        config.stats.spell_power_fire += stats.sp_fire;
        config.stats.crit += self.critRatingToChance(stats.crit);
        config.stats.hit += self.hitRatingToChance(stats.hit);
        config.stats.haste += self.hasteRatingToHaste(stats.haste);
      };

      return new Promise((resolve, reject) => {
        const sim = new SimulationWorkers(self.config.iterations, (result) => {
          self.is_running = false;
          resolve(result);
        }, (error) => {
          self.is_running = false;
          console.error(error);
          reject(error);
        });

        self.log_open = false;
        self.prepare();
        const config = _.cloneDeep(self.config);
        if (rngSeed) {
          config.rng_seed = rngSeed;
        }
        if (value) {
          addStats(config, { [stat]: value });
        }
        self.is_running = true;
        sim.start(config);
      });
    },

    async runEP() {
      if (this.is_running_ep) {
        this.is_running_ep = false;
      }

      if (this.is_running) {
        return;
      }

      this.is_running_ep = true;
      this.result = null;
      this.ep_result = {
        base: null,
        int: null,
        spi: null,
        mp5: null,
        sp: null,
        sp_arcane: null,
        sp_frost: null,
        sp_fire: null,
        crit: null,
        hit: null,
        haste: null,
      };

      const rngSeed = Math.round(Math.random() * 100000);
      let result;
      for (const stat in this.ep_result) {
        result = await this.runStat(stat, stat === 'base' ? 0 : 10, rngSeed);
        this.ep_result[stat] = result.avg_dps;
        if (!this.is_running_ep) {
          break;
        }
      }

      this.is_running_ep = false;

      this.foolsOpen();
    },

    async runComparisonFor(itemId) {
      const self = this;
      this.equip(this.active_slot, itemId, false);

      return new Promise((resolve, reject) => {
        const sim = new SimulationWorkers(self.config.iterations, (result) => {
          self.is_running = false;
          resolve(result);
        }, (error) => {
          self.is_running = false;
          console.error(error);
          reject(error);
        });

        self.log_open = false;
        self.prepare();
        self.is_running = true;
        sim.start(self.config);
      });
    },

    async runComparison() {
      if (!this.hasComparisons || this.is_running) {
        return;
      }

      for (const i in this.item_comparison) {
        this.item_comparison[i].dps = null;
      }

      const oldItemId = this.equipped[this.active_slot];
      let result; let
        cmp;
      for (const i in this.item_comparison) {
        cmp = this.item_comparison[i];
        result = await this.runComparisonFor(cmp.id);
        this.item_comparison[i].dps = result.avg_dps;
      }

      this.equip(this.active_slot, oldItemId);

      this.foolsOpen();
    },

    prepare() {
      this.fillEmptyFields();
      this.saveGear();
      this.saveConfig();
      this.itemStats();
      this.itemConfig();
      this.finalStats();
    },

    setActiveSlot(slot) {
      if (this.is_running) {
        return;
      }

      this.active_slot = slot;
      this.item_comparison = [];

      if (window.$WowheadPower) {
        this.$nextTick(function () {
          this.refreshTooltips();
        });
      }
    },

    equipSlotToItemSlot(slot) {
      if (slot.indexOf('finger') === 0) {
        slot = 'finger';
      }
      if (slot.indexOf('trinket') === 0) {
        slot = 'trinket';
      }

      return slot;
    },

    equipSlotToEnchantSlot(slot) {
      return this.equipSlotToItemSlot(slot);
    },

    dontStack(input, config) {
      if (!Array.isArray(config)) {
        config = [config];
      }

      if (input.target.checked) {
        for (let i = 0; i < config.length; i += 1) {
          const key = config[i];
          if (_.get(this.config, key)) {
            _.set(this.config, key, false);
          }
        }
      }
    },

    findItem(id) {
      let item;
      for (let i = 0; i < this.itemSlots.length; i += 1) {
        item = _.find(this.items.equip[this.itemSlots[i]], { id });
        if (item) {
          return item;
        }
      }

      return null;
    },

    getItem(slot, id) {
      const eslot = this.equipSlotToItemSlot(slot);
      return _.find(this.items.equip[eslot], { id }, null);
    },

    searchItem(slot, title) {
      const eslot = this.equipSlotToItemSlot(slot);
      return _.find(this.items.equip[eslot], { title }, null);
    },

    getGem(id) {
      return _.find(this.items.gems, { id }, null);
    },

    searchGem(title) {
      return _.find(this.items.gems, { title }, null);
    },

    getEnchant(slot, id) {
      const eslot = this.equipSlotToItemSlot(slot);
      return _.find(this.items.enchants[eslot], { id }, null);
    },

    searchEnchant(slot, title) {
      const eslot = this.equipSlotToItemSlot(slot);
      return _.find(this.items.enchants[eslot], { title }, null);
    },

    equippedItem(slot) {
      const id = this.equipped[slot];
      if (!id) {
        return null;
      }

      return this.getItem(slot, id);
    },

    activeGems(index) {
      if (this.activeSockets.length < index) {
        return [];
      }
      let gems;
      if (this.activeSockets[index] === 'm') {
        gems = this.items.gems.filter((g) => g.color === 'm');
      } else {
        gems = this.items.gems.filter((g) => g.color !== 'm');
      }

      if (!this.phase_filter) {
        return gems;
      }

      return gems.filter((g) => _.get(g, 'phase', 1) <= this.phase_filter);
    },

    fillEmptyFields() {
      for (const key in this.config) {
        if (this.config[key] === '' || this.config[key] === null) {
          this.config[key] = Object.prototype.hasOwnProperty.call(this.default_config, key)
            ? this.default_config[key]
            : 0;
        }
      }
    },

    finalStats() {
      let x;
      this.itemStats();
      this.itemConfig();

      const stats = _.cloneDeep(this.config.stats);

      // Attribute additions
      if (this.config.arcane_intellect) {
        stats.intellect += 40;
      }
      if (this.config.divine_spirit) {
        stats.spirit += 40;
      }
      if (this.config.guardian_elixir === this.elixirs.ELIXIR_DRAENIC_WISDOM) {
        stats.intellect += 30;
        stats.spirit += 30;
      }
      if (this.config.battle_elixir === this.elixirs.ELIXIR_MASTERY) {
        stats.intellect += 15;
        stats.spirit += 15;
      }
      if (this.config.mark_of_the_wild) {
        stats.intellect += 18;
        stats.spirit += 18;
      }
      if (this.config.flask === this.flasks.FLASK_DISTILLED_WISDOM) {
        stats.intellect += 65;
      }
      if (this.config.flask === this.flasks.FLASK_CHROMATIC_WONDER) {
        stats.intellect += 18;
        stats.spirit += 18;
      }
      const foodHasSpirit = (
        this.config.food === this.foods.FOOD_SPELL_POWER
        || this.config.food === this.foods.FOOD_SPELL_CRIT
      );
      if (foodHasSpirit) {
        stats.spirit += 20;
      }
      if (this.config.scroll_of_spirit) {
        stats.spirit += 30;
      }
      if (this.config.kreegs) {
        stats.spirit += 25;
        stats.intellect -= 5;
      }

      // Attribute multipliers
      x = this.hasTalent('arcane_mind');
      if (x) {
        stats.intellect *= 1.0 + x * 0.03;
      }
      if (this.config.race === this.races.RACE_GNOME) {
        stats.intellect *= 1.05;
      }
      if (this.config.race === this.races.RACE_HUMAN) {
        stats.spirit *= 1.1;
      }
      if (this.config.blessing_of_kings) {
        stats.intellect *= 1.1;
        stats.spirit *= 1.1;
      }
      if (this.metaGem() && this.metaGem().id === this.items.ids.EMBER_SKYFIRE) {
        stats.intellect *= 1.02;
      }
      stats.intellect = Math.round(stats.intellect);
      stats.spirit = Math.round(stats.spirit);

      // Mp5
      if (this.config.guardian_elixir === this.elixirs.ELIXIR_MAJOR_MAGEBLOOD) {
        stats.mp5 += 16;
      }
      if (this.config.weapon_oil === this.weapon_oils.OIL_SUPERIOR_MANA) {
        stats.mp5 += 14;
      }
      if (this.config.blessing_of_wisdom) {
        stats.mp5 += 49;
      }

      // Spell power
      let intMulti = 0;
      x = this.hasTalent('mind_mastery');
      if (x) {
        intMulti += x * 0.05;
      }
      if (this.config.spellfire_set) {
        intMulti += 0.07;
      }
      if (intMulti > 0) {
        stats.spell_power += Math.round(stats.intellect * intMulti);
      }

      if (this.config.improved_divine_spirit && this.config.divine_spirit) {
        stats.spell_power += stats.spirit * 0.1;
      }
      if (this.config.wrath_of_air) {
        stats.spell_power += 101;
      }
      if (this.config.weapon_oil === this.weapon_oils.OIL_BRILLIANT_WIZARD) {
        stats.spell_power += 36;
      }
      if (this.config.weapon_oil === this.weapon_oils.OIL_SUPERIOR_WIZARD) {
        stats.spell_power += 42;
      }
      if (this.config.weapon_oil === this.weapon_oils.OIL_BLESSED_WIZARD) {
        stats.spell_power += 60;
      }
      if (this.config.food === this.foods.FOOD_SPELL_POWER) {
        stats.spell_power += 23;
      }
      if (this.config.flask === this.flasks.FLASK_SUPREME_POWER) {
        stats.spell_power += 70;
      }
      if (this.config.flask === this.flasks.FLASK_BLINDING_LIGHT) {
        stats.spell_power_arcane += 80;
      }
      if (this.config.flask === this.flasks.FLASK_PURE_DEATH) {
        stats.spell_power_fire += 80;
        stats.spell_power_frost += 80;
      }
      if (this.config.battle_elixir === this.elixirs.ELIXIR_ADEPTS) {
        stats.spell_power += 24;
      }
      if (this.config.battle_elixir === this.elixirs.ELIXIR_GREATER_ARCANE) {
        stats.spell_power += 35;
      }
      if (this.config.battle_elixir === this.elixirs.ELIXIR_MAJOR_FIREPOWER) {
        stats.spell_power_fire += 55;
      }
      if (this.config.atiesh_warlock) {
        stats.spell_power += 33;
      }
      if (this.config.eye_of_the_night) {
        stats.spell_power += 34;
      }
      if (this.config.jade_pendant_of_blasting) {
        stats.spell_power += 15;
      }
      if (this.config.bloodthistle && this.config.race === this.races.RACE_BLOOD_ELF) {
        stats.spell_power += 10;
      }
      if (this.config.scourgebane) {
        stats.spell_power += 15;
      }

      // Spell crit
      let critRating = 0;
      if (this.config.judgement_of_the_crusader) {
        stats.crit += 3;
      }
      if (this.config.moonkin_aura) {
        stats.crit += 5;
      }
      if (this.config.totem_of_wrath) {
        stats.crit += 3;
      }
      if (this.config.molten_armor) {
        stats.crit += 3;
      }
      if (this.config.chain_of_the_twilight_owl) {
        stats.crit += 2;
      }
      if (this.config.battle_elixir === this.elixirs.ELIXIR_ADEPTS) {
        critRating += 24;
      }
      if (this.config.weapon_oil === this.weapon_oils.OIL_BRILLIANT_WIZARD) {
        critRating += 14;
      }
      if (this.config.food === this.foods.FOOD_SPELL_CRIT) {
        critRating += 20;
      }
      if (this.config.atiesh_mage) {
        critRating += 28;
      }
      x = this.hasTalent('arcane_instability');
      if (x) {
        stats.crit += x;
      }
      if (critRating > 0) {
        stats.crit += this.critRatingToChance(critRating);
        stats.crit_rating += critRating;
      }
      stats.crit += stats.intellect / 80;

      // Spell hit
      if (this.config.totem_of_wrath) {
        stats.hit += 3;
      }
      if (this.config.race === this.races.RACE_DRAENEI || (this.faction === 'alliance' && this.config.inspiring_presence)) {
        stats.hit += 1;
      }

      this.final_stats = stats;
    },

    baseStats() {
      // Undead default
      const stats = {
        intellect: 149,
        spirit: 150,
        mp5: 0,
        crit: 0.91,
        hit: 0,
        haste: 0,
        spell_power: 0,
        spell_power_arcane: 0,
        spell_power_frost: 0,
        spell_power_fire: 0,
        crit_rating: 0,
        hit_rating: 0,
        haste_rating: 0,
      };

      if (this.config.race === this.races.RACE_TROLL) {
        stats.intellect = 147;
        stats.spirit = 146;
      }
      if (this.config.race === this.races.RACE_BLOOD_ELF) {
        stats.intellect = 155;
        stats.spirit = 144;
      }
      if (this.config.race === this.races.RACE_DRAENEI) {
        stats.intellect = 152;
        stats.spirit = 147;
      }
      if (this.config.race === this.races.RACE_GNOME) {
        stats.intellect = 155;
        stats.spirit = 145;
      }
      if (this.config.race === this.races.RACE_HUMAN) {
        stats.intellect = 151;
        stats.spirit = 145;
      }

      return stats;
    },

    itemStats() {
      const stats = this.baseStats();

      const itemStats = {
        int: 0,
        spi: 0,
        mp5: 0,
        crit: 0,
        hit: 0,
        sp: 0,
        haste: 0,
        sp_arcane: 0,
        sp_frost: 0,
        sp_fire: 0,
      };

      const addStats = (itm) => {
        for (const stat in itm) {
          if (Object.prototype.hasOwnProperty.call(itemStats, stat)) {
            itemStats[stat] += itm[stat];
          }
        }
      };

      let slot;
      let item;
      let hasBonus;
      let getBonus;
      let enchant;
      let gem;
      let gemId;
      let set;
      let setBonus;
      const sets = {};

      for (const key in this.equipped) {
        slot = this.equipSlotToItemSlot(key);
        item = _.find(this.items.equip[slot], { id: this.equipped[key] });
        if (item) {
          hasBonus = Object.prototype.hasOwnProperty.call(item, 'bonus');
          getBonus = true;

          addStats(item);

          if (this.items.enchants[slot] && this.enchants[key]) {
            enchant = _.find(this.items.enchants[slot], { id: this.enchants[key] });
            if (enchant) {
              addStats(enchant);
            }
          }

          if (item.sockets) {
            for (let i = 0; i < item.sockets.length; i += 1) {
              gemId = this.gems[key][i];
              gem = gemId ? _.find(this.items.gems, { id: gemId }) : null;
              if (gem && (gem.color !== 'm' || this.isMetaGemActive())) {
                addStats(gem);
              }
              if (hasBonus && (!gem || !this.matchSocketColor(item.sockets[i], gem.color))) {
                getBonus = false;
              }
            }

            if (hasBonus && getBonus) {
              addStats(item.bonus);
            }
          }

          if (item.itemset) {
            if (!Object.prototype.hasOwnProperty.call(sets, item.itemset)) {
              sets[item.itemset] = 1;
            } else {
              sets[item.itemset] += 1;
              set = _.find(this.items.itemsets, { id: item.itemset });
              if (set) {
                setBonus = _.get(set, `set${sets[item.itemset]}`);
                if (setBonus) {
                  addStats(setBonus);
                }
              }
            }
          }
        }
      }

      stats.intellect += itemStats.int;
      stats.spirit += itemStats.spi;
      stats.mp5 += itemStats.mp5;
      stats.spell_power += itemStats.sp;
      stats.spell_power_arcane += itemStats.sp_arcane;
      stats.spell_power_frost += itemStats.sp_frost;
      stats.spell_power_fire += itemStats.sp_fire;
      stats.crit += this.critRatingToChance(itemStats.crit);
      stats.hit += this.hitRatingToChance(itemStats.hit);
      stats.haste += this.hasteRatingToHaste(itemStats.haste);

      stats.crit_rating = itemStats.crit;
      stats.hit_rating = itemStats.hit;
      stats.haste_rating = itemStats.haste;

      stats.crit = stats.crit;
      stats.hit = stats.hit;
      stats.haste = stats.haste;

      this.config.stats = stats;
    },

    itemConfig() {
      let num = this.numEquippedSet(this.items.ids.TIRISFAL_SET);
      this.config.tirisfal_2set = num > 1;
      this.config.tirisfal_4set = num > 3;

      num = this.numEquippedSet(this.items.ids.TEMPEST_SET);
      this.config.tempest_2set = num > 1;
      this.config.tempest_4set = num > 3;

      this.config.spellstrike_set = this.numEquippedSet(this.items.ids.SPELLSTRIKE_SET) > 1;
      this.config.spellfire_set = this.numEquippedSet(this.items.ids.SPELLFIRE_SET) > 2;

      this.config.mana_etched_4set = this.numEquippedSet(this.items.ids.MANA_ETCHED_SET) > 3;

      this.config.eternal_sage = this.isEquipped('finger', this.items.ids.ETERNAL_SAGE);
      this.config.wrath_of_cenarius = this.isEquipped('finger', this.items.ids.WRATH_OF_CENARIUS);
      this.config.blade_of_wizardry = this.isEquipped('weapon', this.items.ids.BLADE_OF_WIZARDRY);
      this.config.blade_of_eternal_darkness = this.isEquipped('weapon', this.items.ids.BLADE_OF_ETERNAL_DARKNESS);
      this.config.robe_elder_scribes = this.isEquipped('chest', this.items.ids.ROBE_ELDER_SCRIBES);

      this.config.sunwell_neck_aldor = (this.isEquipped('neck', this.items.ids.PENDANT_OF_ACUMEN) && this.config.shatt_faction === this.factions.FACTION_ALDOR);
      this.config.sunwell_neck_scryer = (this.isEquipped('neck', this.items.ids.PENDANT_OF_ACUMEN) && this.config.shatt_faction === this.factions.FACTION_SCRYER);

      if (this.isEquipped('neck', this.items.ids.EYE_OF_THE_NIGHT)) {
        this.config.eye_of_the_night = true;
      }
      if (this.isEquipped('neck', this.items.ids.CHAIN_OF_THE_TWILIGHT_OWL)) {
        this.config.chain_of_the_twilight_owl = true;
      }
      if (this.isEquipped('neck', this.items.ids.JADE_PENDANT_OF_BLASTING)) {
        this.config.jade_pendant_of_blasting = true;
      }

      this.config.trinket1 = 0;
      this.config.trinket2 = 0;
      this.config.meta_gem = 0;
      if (this.isSpecialItem(this.equipped.trinket1)) {
        this.config.trinket1 = this.equipped.trinket1;
      }
      if (this.isSpecialItem(this.equipped.trinket2)) {
        this.config.trinket2 = this.equipped.trinket2;
      }
      if (this.metaGem() && this.isSpecialItem(this.metaGem().id) && this.isMetaGemActive()) {
        this.config.meta_gem = this.metaGem().id;
      }
    },

    openItem(item) {
      const a = document.createElement('a');
      a.href = this.itemUrl(item.id);
      a.target = '_blank';
      a.click();
    },

    itemUrl(id) {
      if (typeof (id) === 'object') {
        id = id.id;
      }
      if (id > 99900) {
        return null;
      }
      if (this.item_source === 'tbcdb') {
        return `https://tbcdb.com/?item=${id}`;
      }
      if (this.item_source === 'endless') {
        return `https://db.endless.gg/?item=${id}`;
      }
      if (this.item_source === 'twinstar') {
        return `https://tbc-twinhead.twinstar.cz/?item=${id}`;
      }
      return `https://tbc.wowhead.com/?item=${id}`;
    },

    spellUrl(id) {
      if (typeof (id) === 'object') {
        id = id.id;
      }
      if (this.item_source === 'tbcdb') {
        return `https://tbcdb.com/?spell=${id}`;
      }
      if (this.item_source === 'endless') {
        return `https://db.endless.gg/?spell=${id}`;
      }
      if (this.item_source === 'twinstar') {
        return `https://tbc-twinhead.twinstar.cz/?spell=${id}`;
      }
      return `https://tbc.wowhead.com/?spell=${id}`;
    },

    critRatingToChance(rating) {
      return rating / 22.08;
    },

    hitRatingToChance(rating) {
      return rating / 12.62;
    },

    hasteRatingToHaste(rating) {
      return rating / 15.77;
    },

    isSpecialItem(itemId) {
      for (const key in this.items.ids) {
        if (this.items.ids[key] === itemId) {
          return true;
        }
      }
      return false;
    },

    onUnequip(slot) {
      if (slot === 'neck') {
        if (this.equipped[slot] === this.items.ids.EYE_OF_THE_NIGHT) {
          this.config.eye_of_the_night = false;
        }
        if (this.equipped[slot] === this.items.ids.CHAIN_OF_THE_TWILIGHT_OWL) {
          this.config.chain_of_the_twilight_owl = false;
        }
        if (this.equipped[slot] === this.items.ids.JADE_PENDANT_OF_BLASTING) {
          this.config.jade_pendant_of_blasting = false;
        }
        this.saveConfig();
      }

      if (this.equipped[slot] && this.gems[slot]) {
        this.item_gems[this.equipped[slot]] = this.gems[slot];
      }

      if (slot === 'weapon' && this.equipped.off_hand) {
        this.item_off_hand = this.equipped.off_hand;
      }
    },

    equipToggle(slot, item) {
      if (this.equipped[slot] === item.id) {
        this.unequip(slot);
      } else {
        this.equip(slot, item);
      }
    },

    unequip(slot, save) {
      this.onUnequip(slot);
      this.equipped[slot] = null;
      this.gems[slot] = [null, null, null];

      this.finalStats();
      if (typeof (save) === 'undefined' || save) {
        this.saveGear();
      }
    },

    equip(slot, item, save) {
      if (!_.isObject(item)) {
        item = this.getItem(slot, item);
      }

      if (this.equipped[slot] === item.id) {
        return;
      }

      if (slot === 'off_hand') {
        const weapon = this.equippedItem('weapon');
        if (weapon.twohand) {
          return;
        }
        this.item_off_hand = item.id;
      }

      if (slot.indexOf('trinket') === 0) {
        const other = slot === 'trinket1' ? 'trinket2' : 'trinket1';
        if (this.isEquipped(other, item.id)) {
          return;
        }
      }

      this.onUnequip(slot);

      if (slot === 'weapon') {
        if (item.twohand) {
          this.equipped.off_hand = null;
        } else if (!this.equipped.off_hand && this.item_off_hand) {
          this.equipped.off_hand = this.item_off_hand;
        }
      }

      this.equipped[slot] = item.id;

      if (Object.prototype.hasOwnProperty.call(this.item_gems, item.id)) {
        this.gems[slot] = this.item_gems[item.id];
      } else {
        this.gems[slot] = [null, null, null];
        if (item.sockets) {
          this.gems[slot] = this.defaultGems(item);
          this.item_gems[item.id] = this.gems[slot];
        }
      }

      this.finalStats();
      if (typeof (save) === 'undefined' || save) {
        this.saveGear();
      }

      this.refreshTooltips();
    },

    isEquipped(slot, id) {
      if (slot === 'trinket' || slot === 'finger') {
        return this.isEquipped(`${slot}1`, id) || this.isEquipped(`${slot}2`, id);
      }

      return _.get(this.equipped, slot) === id;
    },

    numEquippedSet(id) {
      let num = 0;

      for (const key in this.equipped) {
        const slot = this.equipSlotToItemSlot(key);
        const item = _.find(this.items.equip[slot], { id: this.equipped[key] });
        if (item && _.get(item, 'itemset') === id) {
          num += 1;
        }
      }

      return num;
    },

    enchant(slot, item) {
      if (this.enchants[slot] === item.id) {
        this.enchants[slot] = null;
      } else {
        this.enchants[slot] = item.id;
      }

      this.saveGear();
      this.finalStats();
    },

    isEnchanted(slot, id) {
      if (slot === 'trinket' || slot === 'finger') {
        return this.isEnchanted(`${slot}1`) || this.isEnchanted(`${slot}2`);
      }

      return _.get(this.enchants, slot) === id;
    },

    setSocket(slot, gem, index) {
      if (this.isSocketed(slot, gem.id, index)) {
        this.gems[slot].splice(index, 1, null);
      } else {
        if (gem.unique && this.isSocketedAnywhere(gem.id)) {
          return;
        }
        this.gems[slot].splice(index, 1, gem.id);
      }

      const itemId = this.equipped[slot];
      if (itemId) {
        if (!Object.prototype.hasOwnProperty.call(this.item_gems, itemId)) {
          this.item_gems[itemId] = [null, null, null];
        }
        this.item_gems[itemId].splice(index, 1, gem.id);
      }

      this.saveGear();
      this.finalStats();
    },

    quickset(set) {
      for (const slot in set.equip) {
        this.equipped[slot] = set.equip[slot];
      }
      for (const slot in set.enchants) {
        this.enchants[slot] = set.enchants[slot];
      }
      for (const slot in set.gems) {
        this.gems[slot] = set.gems[slot];
        if (this.equipped[slot]) {
          this.item_gems[this.equipped[slot]] = this.gems[slot];
        }
      }

      this.saveGear();
      this.finalStats();
    },

    matchSocketColor(sock, gem) {
      if (gem === 'a') {
        return true;
      }
      if (sock === gem) {
        return true;
      }
      if (sock === 'r' && ['o', 'p'].indexOf(gem) !== -1) {
        return true;
      }
      if (sock === 'y' && ['o', 'g'].indexOf(gem) !== -1) {
        return true;
      }
      if (sock === 'b' && ['g', 'p'].indexOf(gem) !== -1) {
        return true;
      }
      return false;
    },

    hasSocketBonus(slot, gems) {
      if (!gems) {
        gems = this.gems[slot];
      }

      const item = this.equippedItem(slot);

      if (item && item.sockets && item.bonus) {
        for (let i = 0; i < item.sockets.length; i += 1) {
          const gemId = gems[i];
          const gem = gemId ? _.find(this.items.gems, { id: gemId }) : null;
          if (!gem || !this.matchSocketColor(item.sockets[i], gem.color)) {
            return false;
          }
        }

        return true;
      }

      return false;
    },

    isSocketed(slot, id, index) {
      return _.get(this.gems[slot], index) === id;
    },

    isSocketedAnywhere(id) {
      for (const slot in this.gems) {
        for (let i = 0; i < this.gems[slot].length; i += 1) {
          if (id === this.gems[slot][i]) {
            return true;
          }
        }
      }
      return false;
    },

    metaGemHasCustomReq(meta) {
      return typeof (meta.req) === 'string';
    },

    isMetaGemActive() {
      if (this.equipped.head && this.metaGem()) {
        const meta = this.metaGem();
        if (!meta.req) {
          return true;
        }

        const colors = { r: 0, b: 0, y: 0 };
        for (const slot in this.gems) {
          if (this.equipped[slot]) {
            for (const i in this.gems[slot]) {
              if (this.gems[slot][i]) {
                const gem = this.getGem(this.gems[slot][i]);
                if (gem) {
                  if (gem.color === 'a') {
                    colors.b += 1;
                    colors.r += 1;
                    colors.y += 1;
                  } else if (gem.color === 'o') {
                    colors.r += 1;
                    colors.y += 1;
                  } else if (gem.color === 'g') {
                    colors.y += 1;
                    colors.b += 1;
                  } else if (gem.color === 'p') {
                    colors.r += 1;
                    colors.b += 1;
                  } else if (gem.color !== 'm') {
                    colors[gem.color] += 1;
                  }
                }
              }
            }
          }
        }

        if (!this.metaGemHasCustomReq(meta)) {
          for (const color in meta.req) {
            if (meta.req[color] > colors[color]) {
              return false;
            }
          }
        } else if (meta.id === this.items.ids.MYSTICAL_SKYFIRE) {
          return colors.b > colors.y;
        }
      }
      return true;
    },

    metaGem() {
      for (const key in this.gems.head) {
        if (this.gems.head[key]) {
          const gem = _.find(this.items.gems, { id: this.gems.head[key] });
          if (gem && gem.color === 'm') {
            return gem;
          }
        }
      }

      return null;
    },

    defaultGems(item) {
      const gems = [null, null, null];

      if (item.sockets) {
        for (let i = 0; i < item.sockets.length; i += 1) {
          gems[i] = this.defaultGem(item.sockets[i]);
        }
      }

      return gems;
    },

    defaultGem(color) {
      if (color === 'm') {
        return this.items.ids.CHAOTIC_SKYFIRE;
      }

      if (this.config.main_rotation === this.main_rotations.MAIN_ROTATION_AB) {
        return this.items.ids.BRILLIANT_DAWNSTONE;
      }
      return this.items.ids.RUNED_LIVING_RUBY;
    },

    setSpec(spec) {
      let talents = null;

      if (spec === 'arcane') {
        talents = 'https://tbc.wowhead.com/talent-calc/mage/2500250300030150330125--053500031003001';
        if (this.spec !== 'arcane') {
          this.config.main_rotation = this.main_rotations.MAIN_ROTATION_AB;
        }
      } else if (spec === 'frost') {
        talents = 'https://tbc.wowhead.com/talent-calc/mage/2500250300030150330125--053500031003001';
        if (this.spec !== 'frost') {
          this.config.main_rotation = this.main_rotations.MAIN_ROTATION_FRB;
        }
      } else if (spec === 'fire') {
        talents = 'https://tbc.wowhead.com/talent-calc/mage/2-505202012303331053125-043500001';
        if (this.spec !== 'fire') {
          this.config.main_rotation = this.main_rotations.MAIN_ROTATION_FIB;
        }
      }

      if (talents) {
        this.config.talents = talents;
      }
    },

    hasTalent(talent) {
      const indexes = {
        clearcast: [0, 5],
        presence_of_mind: [0, 13],
        arcane_mind: [0, 14],
        arcane_instability: [0, 16],
        arcane_power: [0, 19],
        mind_mastery: [0, 21],
        imp_scorch: [1, 9],
        combustion: [1, 18],
        icy_veins: [2, 8],
        cold_snap: [2, 14],
      };

      if (!Object.prototype.hasOwnProperty.call(indexes, talent)) {
        return false;
      }

      const m = this.config.talents.match(/tbc\.wowhead\.com.*mage\/([0-9-]+)$/);
      if (m) {
        const str = m[1];
        let tree = 0; let
          t = 0;

        for (let i = 0; i < str.length; i += 1) {
          if (str[i] === '-') {
            tree += 1;
            t = 0;
          } else {
            if (tree === indexes[talent][0] && t === indexes[talent][1]) {
              return parseInt(str[i], 10);
            }
            t += 1;
          }
        }
      }

      return false;
    },

    hasUseTrinket(nr) {
      const slot = `trinket${nr}`;
      const item = this.equippedItem(slot);

      if (item && item.use) {
        return true;
      }

      return false;
    },

    isComparing(item) {
      return _.findIndex(this.item_comparison, { id: item.id }) !== -1;
    },

    compareAll() {
      if (this.active_slot === 'quicksets') {
        return;
      }

      if (
        this.item_comparison.length === this.activeItems.length
        && _.find(this.item_comparison, { id: this.activeItems[0].id })
      ) {
        this.item_comparison = [];
      } else {
        this.item_comparison = [];
        for (const i in this.activeItems) {
          this.item_comparison.push({ id: this.activeItems[i].id, dps: null });
        }
      }
    },

    compareItem(item) {
      const index = _.findIndex(this.item_comparison, { id: item.id });
      if (index === -1) {
        this.item_comparison.push({ id: item.id, dps: null });
      } else {
        this.item_comparison.splice(index, 1);
      }
    },

    comparisonDps(item) {
      const cmp = _.find(this.item_comparison, { id: item.id });
      const cmp2 = _.find(this.item_comparison, { id: this.items.ids.STAT_WEIGHT_BASE });
      if (cmp2 && cmp2.dps && item.id !== this.items.ids.STAT_WEIGHT_BASE) {
        return cmp && cmp.dps ? `+${_.round(cmp.dps - cmp2.dps, 2)}` : null;
      }
      return cmp && cmp.dps ? _.round(cmp.dps, 2) : null;
    },

    onTalentsInput(e) {
      this.config.talents = this.conformTalents(e.target.value);
      e.preventDefault();
    },

    conformTalents(talents) {
      const m = talents.match(/tbcdb\.com.*mage&([0-9]+)/i);
      if (m) {
        const fn = function (str) {
          return str.replace(/[0]+$/, '');
        };
        talents = `https://tbc.wowhead.com/talent-calc/mage/${fn(m[1].substr(0, 23))}-${fn(m[1].substr(23, 22))}-${fn(m[1].substr(45))}`;
      }

      return talents;
    },

    addFillerTiming() {
      this.config.filler_start_t.push(null);
      this.config.filler_end_t.push(null);
    },

    deleteFillerTiming(index) {
      this.config.filler_start_t.splice(index, 1);
      this.config.filler_end_t.splice(index, 1);
    },

    formatStats(item) {
      const stats = [];

      if (item.sp) {
        stats.push(`${item.sp} sp`);
      }
      if (item.hit) {
        stats.push(`${item.hit} hit`);
      }
      if (item.crit) {
        stats.push(`${item.crit} crit`);
      }
      if (item.haste) {
        stats.push(`${item.haste} haste`);
      }
      if (item.int) {
        stats.push(`${item.int} int`);
      }
      if (item.spi) {
        stats.push(`${item.spi} spi`);
      }
      if (item.mp5) {
        stats.push(`${item.mp5} mp5`);
      }
      if (item.desc) {
        stats.push(item.desc);
      }

      return stats.join(' / ');
    },

    formatKey(str) {
      return _.startCase(str);
    },

    formatSockets(item) {
      if (!item.sockets) {
        return null;
      }

      return item.sockets.join(' / ');
    },

    formatSP(data) {
      const arr = [];

      if (data.sp) {
        arr.push(data.sp);
      }
      if (data.sp_arcane) {
        arr.push(`${data.sp_arcane} arc`);
      }
      if (data.sp_frost) {
        arr.push(`${data.sp_frost} frost`);
      }
      if (data.sp_fire) {
        arr.push(`${data.sp_fire} fire`);
      }

      if (data.spell_power) {
        arr.push(data.spell_power);
      }
      if (data.spell_power_arcane) {
        arr.push(`${data.spell_power_arcane} arc`);
      }
      if (data.spell_power_frost) {
        arr.push(`${data.spell_power_frost} frost`);
      }
      if (data.spell_power_fire) {
        arr.push(`${data.spell_power_fire} fire`);
      }

      return arr.join(' / ');
    },

    formatTime(s) {
      let dec = Math.round((s % 1) * 100);
      let sec = Math.floor(s);
      if (dec === 100) {
        dec = 0;
        sec += 1;
      }

      return `${sec < 10 ? `0${sec}` : sec}.${dec < 10 ? `0${dec}` : dec}`;
    },

    round(num) {
      return Math.round(num);
    },

    openJsonStats() {
      if (!this.epCalc) {
        return;
      }

      const weight = this.ep_weight;
      this.ep_weight = 'sp';

      const epRound = function (value) {
        if (value === null || Number.isNaN(value)) {
          return 0;
        }
        return _.round(value, 2);
      };

      const data = {
        spellDamage: epRound(this.epCalc.sp),
        arcaneDamage: epRound(this.epCalc.sp_arcane),
        fireDamage: epRound(this.epCalc.sp_fire),
        frostDamage: epRound(this.epCalc.sp_frost),
        spellCritRating: epRound(this.epCalc.crit),
        spellHasteRating: epRound(this.epCalc.haste),
        spellHitRating: epRound(this.epCalc.hit),
        intellect: epRound(this.epCalc.int),
        mp5: epRound(this.epCalc.mp5),
        spirit: epRound(this.epCalc.spi),
        redSockets: epRound(this.epCalc.sp * 12),
        yellowSockets: epRound(this.epCalc.sp * 12),
        blueSockets: epRound(this.epCalc.sp * 12),
      };

      this.json_stats_string = JSON.stringify(data, null, 4);
      this.ep_weight = weight;
      this.json_stats_open = true;

      this.$nextTick(function () {
        this.$refs.json_string_input.select();
      });
    },

    closeJsonStats() {
      this.json_stats_open = false;
    },

    exportString() {
      const data = {
        equipped: this.export_profile.items ? _.cloneDeep(this.equipped) : null,
        enchants: this.export_profile.items ? _.cloneDeep(this.enchants) : null,
        gems: this.export_profile.items ? _.cloneDeep(this.gems) : null,
        config: this.export_profile.config ? _.cloneDeep(this.config) : null,
      };

      return btoa(JSON.stringify(data));
    },

    checkImportString() {
      const json = atob(this.import_profile.string);
      if (!json) {
        return;
      }

      let data;
      try {
        data = JSON.parse(json);
      } catch (e) {
        return;
      }

      if (!data) {
        return;
      }

      this.import_status.items = _.get(data, 'equipped', null) !== null;
      this.import_status.config = _.get(data, 'config', null) !== null;
    },

    importString(str) {
      const json = atob(str);
      if (!json) {
        return this.importError('Could not parse import string');
      }

      let data;
      try {
        data = JSON.parse(json);
      } catch (e) {
        return this.importError('Could not parse import string');
      }

      if (!data) {
        return this.importError('Could not parse import string');
      }

      if (!data.equipped && !data.enchants && !data.gems && !data.config) {
        return this.importError('Invalid import string');
      }

      if (!this.import_profile.items) {
        data.equipped = null;
        data.enchants = null;
        data.gems = null;
      }
      if (!this.import_profile.config) {
        data.config = null;
      }

      this.loadProfile(data);

      return true;
    },

    importError(err) {
      alert(err);
      this.import_profile.string = null;
      this.$refs.import_input.focus();
      return false;
    },

    doImport() {
      if (this.import_profile.string && this.importString(this.import_profile.string)) {
        this.closeImport();
      }
    },

    openExport() {
      this.export_profile.string = this.exportString();
      this.export_profile.open = true;

      this.$nextTick(function () {
        this.$refs.export_input.select();
      });
    },

    updateExport() {
      const self = this;
      setTimeout(() => {
        self.export_profile.string = self.exportString();

        self.$nextTick(() => {
          self.$refs.export_input.select();
        });
      }, 100);
    },

    openImport() {
      this.import_profile.string = null;
      this.import_profile.open = true;

      this.$nextTick(function () {
        this.$refs.import_input.focus();
      });
    },

    closeExport() {
      this.export_profile.open = false;
      this.export_profile.string = null;
    },

    closeImport() {
      this.import_profile.open = false;
      this.import_profile.string = null;
    },

    openSeventyUpgradesImport() {
      this.import_seventy_upgrades.string = null;
      this.import_seventy_upgrades.open = true;

      this.$nextTick(function () {
        this.$refs.import_seventy_upgrades_input.focus();
      });
    },

    closeSeventyUpgradesImport() {
      this.import_seventy_upgrades.open = false;
      this.import_seventy_upgrades.string = null;
    },

    doSeventyUpgradesImport() {
      if (
        this.import_seventy_upgrades.string
        && this.importSeventyUpgradesString(this.import_seventy_upgrades.string)
      ) {
        this.closeSeventyUpgradesImport();
      }
    },

    importSeventyUpgradesError(err) {
      alert(err);
      this.import_seventy_upgrades.string = null;
      this.$refs.import_seventy_upgrades_input.focus();
      return false;
    },

    importSeventyUpgradesString(str) {
      let data;
      try {
        data = JSON.parse(str);
      } catch (e) {
        return this.importSeventyUpgradesError('Could not parse import string');
      }

      if (!data) {
        return this.importSeventyUpgradesError('Could not parse import string');
      }

      if (!data.items) {
        return this.importSeventyUpgradesError('Invalid import string');
      }

      const profile = {
        items: null,
        enchants: null,
        gems: null,
        config: null,
      };

      if (this.import_seventy_upgrades.items) {
        profile.equipped = {};
        profile.enchants = {};
        profile.gems = {};

        for (const key in this.equipped) {
          profile.equipped[key] = null;
          profile.enchants[key] = null;
          profile.gems[key] = [null, null, null];
        }

        for (let i = 0; i < data.items.length; i += 1) {
          const slot = this.getSlotFromSeventyUpgrades(data.items[i]);
          if (!slot) {
            continue;
          }
          let item = this.getItem(slot, data.items[i].id);
          if (!item) {
            item = this.searchItem(data.items[i].name);
          }
          if (!item) {
            return this.importSeventyUpgradesError(`Could not find item: ${data.items[i].name}`);
          }
          profile.equipped[slot] = item.id;

          if (data.items[i].enchant) {
            const enchant = this.getEnchantFromSeventyUpgrades(slot, data.items[i].enchant);
            if (!enchant) {
              return this.importSeventyUpgradesError(`Could not find enchant: ${data.items[i].enchant.name}`);
            }
            profile.enchants[slot] = enchant.id;
          }

          if (data.items[i].gems) {
            for (let j = 0; j < data.items[i].gems.length; j += 1) {
              let gem = this.getGem(data.items[i].gems[j].id);
              if (!gem) {
                gem = this.searchGem(data.items[i].gems[j].name);
              }
              if (!gem) {
                return this.importSeventyUpgradesError(`Could not find gem: ${data.items[i].gems[j].name}`);
              }
              profile.gems[slot][j] = gem.id;
            }
          }
        }
      }

      if (this.import_seventy_upgrades.config && data.exportOptions.buffs) {
        profile.config = {
          scroll_of_spirit: false,
          battle_elixir: 0,
          guardian_elixir: 0,
          flask: 0,
          food: 0,
          weapon_oil: 0,
          mage_armor: false,
          molten_armor: false,
          arcane_intellect: false,
          blessing_of_kings: false,
          blessing_of_wisdom: false,
          divine_spirit: false,
          improved_divine_spirit: false,
          totem_of_wrath: false,
          wrath_of_air: false,
          inspiring_presence: false,
          mark_of_the_wild: false,
          moonkin_aura: false,
        };

        if (data.character.race === 'BLOODELF') {
          profile.race = constants.races.RACE_BLOOD_ELF;
        } else if (data.character.race === 'DRAENEI') {
          profile.race = constants.races.RACE_DRAENEI;
        } else if (data.character.race === 'GNOME') {
          profile.race = constants.races.RACE_GNOME;
        } else if (data.character.race === 'HUMAN') {
          profile.race = constants.races.RACE_HUMAN;
        } else if (data.character.race === 'TROLL') {
          profile.race = constants.races.RACE_TROLL;
        } else if (data.character.race === 'UNDEAD') {
          profile.race = constants.races.RACE_UNDEAD;
        } else {
          return this.importSeventyUpgradesError(`Unknown race: ${data.character.race}`);
        }

        // Consumes
        const guardian = [
          constants.elixirs.ELIXIR_MAJOR_MAGEBLOOD,
          constants.elixirs.ELIXIR_DRAENIC_WISDOM,
        ];
        const elixirs = _.values(constants.elixirs);
        const flasks = _.values(constants.flasks);
        const foods = _.values(constants.foods);
        const weaponOils = _.values(constants.weapon_oils);
        for (const consume of data.consumables) {
          if (weaponOils.indexOf(consume.id) !== -1) {
            profile.config.weapon_oil = consume.id;
          } else if (foods.indexOf(consume.id) !== -1) {
            profile.config.food = consume.id;
          } else if (flasks.indexOf(consume.id) !== -1) {
            profile.config.flask = consume.id;
          } else if (elixirs.indexOf(consume.id) !== -1) {
            if (guardian.indexOf(consume.id) !== -1) {
              profile.config.guardian_elixir = consume.id;
            } else {
              profile.config.battle_elixir = consume.id;
            }
          } else if (consume.id === 27501) {
            profile.config.scroll_of_spirit = true;
          }
        }

        // buffs
        for (const buff of data.buffs) {
          if (buff.id === 27125) {
            profile.config.mage_armor = true;
          } else if (buff.id === 30482) {
            profile.config.molten_armor = true;
          } else if (buff.id === 3738) {
            profile.config.wrath_of_air = true;
          } else if (buff.id === 30706) {
            profile.config.totem_of_wrath = true;
          } else if (buff.id === 26990) {
            profile.config.mark_of_the_wild = true;
          } else if (buff.id === 27126) {
            profile.config.arcane_intellect = true;
          } else if (buff.id === 20217) {
            profile.config.blessing_of_kings = true;
          } else if (buff.id === 27142) {
            profile.config.blessing_of_wisdom = true;
          } else if (buff.id === 28878 && data.character.faction === 'ALLIANCE') {
            profile.config.inspiring_presence = true;
          } else if (buff.id === 25312) {
            profile.config.scroll_of_spirit = false;
            profile.config.divine_spirit = true;
            if (buff.improvements && buff.improvements.length) {
              profile.config.improved_divine_spirit = true;
            }
          }
        }
        if (profile.config.mage_armor && profile.config.molten_armor) {
          profile.config.molten_armor = false;
        }
      }

      if (this.import_seventy_upgrades.config && data.exportOptions.talents) {
        const talents = [
          '00000000000000000000000',
          '0000000000000000000000',
          '0000000000000000000000',
        ];

        const tmap = {
          'Arcane Subtlety': [0, 0],
          'Arcane Focus': [0, 1],
          'Improved Arcane Missiles': [0, 2],
          'Wand Specialization': [0, 3],
          'Magic Absorption': [0, 4],
          'Arcane Concentration': [0, 5],
          'Magic Attunement': [0, 6],
          'Arcane Impact': [0, 7],
          'Arcane Fortitude': [0, 8],
          'Improved Mana Shield': [0, 9],
          'Improved Counterspell': [0, 10],
          'Arcane Meditation': [0, 11],
          'Improved Blink': [0, 12],
          'Presence of Mind': [0, 13],
          'Arcane Mind': [0, 14],
          'Prismatic Cloak': [0, 15],
          'Arcane Instability': [0, 16],
          'Arcane Potency': [0, 17],
          'Empowered Arcane Missiles': [0, 18],
          'Arcane Power': [0, 19],
          'Spell Power': [0, 20],
          'Mind Mastery': [0, 20],
          Slow: [0, 22],
          'Improved Fireball': [1, 0],
          Impact: [1, 1],
          Ignite: [1, 2],
          'Flame Throwing': [1, 3],
          'Improved Fire Blast': [1, 4],
          Incineration: [1, 5],
          Incinerate: [1, 5],
          'Improved Flamestrike': [1, 6],
          Pyroblast: [1, 7],
          'Burning Soul': [1, 8],
          'Improved Scorch': [1, 9],
          'Molten Shields': [1, 10],
          'Improved Fire Ward': [1, 10],
          'Master of Elements': [1, 11],
          'Playing with Fire': [1, 12],
          'Critical Mass': [1, 13],
          'Blast Wave': [1, 14],
          'Blazing Speed': [1, 15],
          'Fire Power': [1, 16],
          Pyromaniac: [1, 17],
          Combustion: [1, 18],
          'Molten Fury': [1, 19],
          'Empowered Fireball': [1, 20],
          "Dragon's Breath": [1, 21],
          'Frost Warding': [2, 0],
          'Improved Frostbolt': [2, 1],
          'Elemental Precision': [2, 2],
          'Ice Shards': [2, 3],
          Frostbite: [2, 4],
          'Improved Frost Nova': [2, 5],
          Permafrost: [2, 6],
          'Piercing Ice': [2, 7],
          'Icy Veins': [2, 8],
          'Improved Blizzard': [2, 9],
          'Arctic Reach': [2, 10],
          'Frost Channeling': [2, 11],
          Shatter: [2, 12],
          'Frozen Core': [2, 13],
          'Cold Snap': [2, 14],
          'Improved Cone of Cold': [2, 15],
          'Ice Floes': [2, 16],
          "Winter's Chill": [2, 17],
          'Ice Barrier': [2, 18],
          'Arctic Winds': [2, 19],
          'Empowered Frostbolt': [2, 20],
          'Summon Water Elemental': [2, 21],
        };

        for (const talent of data.talents) {
          if (!Object.prototype.hasOwnProperty.call(tmap, talent.name)) {
            return this.importSeventyUpgradesError(`Unknown talent: ${talent.name}`);
          }
          const t = tmap[talent.name];
          talents[t[0]] = talents[t[0]].substr(0, t[1])
            + talent.rank
            + talents[t[0]].substr(t[1] + 1);
        }

        let tstring = `${talents[0]}-${talents[1]}-${talents[2]}`;
        tstring = tstring.replace(/0+-/g, '-');
        tstring = tstring.replace(/0+$/g, '');
        tstring = `https://tbc.wowhead.com/talent-calc/mage/${tstring}`;
        profile.config.talents = tstring;
      }

      this.loadProfile(profile);

      return true;
    },

    getSlotFromSeventyUpgrades(data) {
      let slot = _.isString(data) ? data : data.slot;
      slot = slot.toLowerCase();
      slot = slot.replace('finger_', 'finger');
      slot = slot.replace('trinket_', 'trinket');
      if (slot === 'main_hand') {
        slot = 'weapon';
      }
      if (!Object.prototype.hasOwnProperty.call(this.equipped, slot)) {
        return null;
      }
      return slot;
    },

    getItemFromSeventyUpgrades(data) {
      const slot = this.getSlotFromSeventyUpgrades(data.slot);
      if (!slot) {
        return null;
      }
      return this.getItem(slot, data.id);
    },

    getEnchantFromSeventyUpgrades(slot, data) {
      if (!data.spellId) {
        if (data.itemId) {
          const map = {
            28886: 35406,
            28909: 35437,
            23545: 29467,
            28881: 35405,
            28903: 35436,
            29191: 35447,
            19787: 24164,
            24274: 31372,
            24273: 31371,
          };
          if (Object.prototype.hasOwnProperty.call(map, data.itemId)) {
            return this.getEnchant(slot, map[data.itemId]);
          }
          return this.searchEnchant(slot, data.name);
        }

        return this.searchEnchant(slot, data.name);
      }

      let enchant = this.getEnchant(slot, data.spellId);
      if (!enchant) {
        enchant = this.searchEnchant(slot, data.name);
      }
      return enchant;
    },

    moveProfile(index, dir) {
      const pos = (this.profiles.length + index + dir) % this.profiles.length;
      this.profiles.splice(pos, 0, this.profiles.splice(index, 1)[0]);
      this.saveProfiles();
    },

    saveProfile(profile) {
      profile.equipped = _.cloneDeep(this.equipped);
      delete profile.equipped.stat_weight;
      profile.enchants = _.cloneDeep(this.enchants);
      profile.gems = _.cloneDeep(this.gems);
      profile.config = _.cloneDeep(this.config);

      const index = _.findIndex(this.profiles, { id: profile.id });
      if (index !== -1) {
        this.profiles.splice(index, 1, profile);
      } else {
        this.profiles.push(profile);
      }

      this.saveProfiles();
    },

    loadProfile(profile, only) {
      this.profile_status.open = true;
      this.profile_status.items = false;
      this.profile_status.config = false;
      this.profile_status.missing_items = [];

      if (profile.equipped && (!only || only === 'items')) {
        profile.equipped = _.pick(profile.equipped, _.keys(this.equipped));
        delete profile.equipped.stat_weight;
        for (const slot in profile.equipped) {
          if (profile.equipped[slot] && !this.getItem(slot, profile.equipped[slot])) {
            profile.equipped[slot] = null;
            this.profile_status.missing_items.push(this.equipSlotToItemSlot(slot));
          }
        }
        _.merge(this.equipped, profile.equipped);
        this.profile_status.items = true;
      }

      if (profile.enchants && (!only || only === 'items')) {
        profile.enchants = _.pick(profile.enchants, _.keys(this.enchants));
        profile.enchants = this.convertEnchants(profile.enchants);
        for (const slot in profile.enchants) {
          if (!this.getEnchant(slot, profile.enchants[slot])) {
            profile.enchants[slot] = null;
          }
        }
        _.merge(this.enchants, profile.enchants);
      }

      if (profile.gems && (!only || only === 'items')) {
        profile.gems = _.pick(profile.gems, _.keys(this.gems));
        profile.gems = this.convertGems(profile.gems);
        for (const slot in profile.gems) {
          for (const i in profile.gems[slot]) {
            if (!this.getGem(profile.gems[slot][i])) {
              profile.gems[slot][i] = null;
            }
          }
        }
        _.merge(this.gems, profile.gems);
      }

      if (profile.config && (!only || only === 'config')) {
        _.merge(this.config, _.pick(profile.config, _.keys(this.config)));
        this.onLoadConfig(profile.config);
        this.profile_status.config = true;
      }

      this.finalStats();

      if (!only || only === 'items') {
        this.saveGear();
      }

      if (profile.config && (!only || only === 'config')) {
        this.saveConfig();
      }

      const self = this;
      clearTimeout(this.profile_status.timeout);
      this.profile_status.timeout = setTimeout(() => {
        self.profile_status.open = false;
      }, 4000);
    },

    deleteProfile(profile) {
      const index = _.findIndex(this.profiles, { id: profile.id });
      if (index !== -1) {
        this.profiles.splice(index, 1);
        this.saveProfiles();
      }
    },

    newProfile() {
      if (!this.new_profile) {
        return;
      }

      const profile = {
        id: this.uuid(),
        name: this.new_profile,
        equipped: {},
        enchants: {},
        gems: {},
        config: {},
      };

      this.new_profile = null;

      this.saveProfile(profile);
    },

    uuid() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        // eslint-disable-next-line no-bitwise
        const r = Math.random() * 16 | 0; const
          // eslint-disable-next-line no-bitwise
          v = c === 'x' ? r : ((r & 0x3) | 0x8);
        return v.toString(16);
      });
    },

    copyEquiplist() {
      const arr = [];

      let str; let item; let enchant; let
        gem;
      for (const slot in this.equipped) {
        if (!this.equipped[slot]) {
          continue;
        }
        item = this.getItem(slot, this.equipped[slot]);
        str = `${this.formatKey(slot)}: ${item.title}`;

        if (_.get(this.enchants, slot)) {
          enchant = this.getEnchant(slot, this.enchants[slot]);
          str += ` (${enchant.title})`;
        }

        if (_.get(this.gems, slot)) {
          for (const i in this.gems[slot]) {
            if (this.gems[slot][i]) {
              gem = this.getGem(this.gems[slot][i]);
              str += ` [${gem.title}]`;
            }
          }
        }

        arr.push(str);
      }

      str = arr.join('\r\n');
      this.$copyToClipboard(str);
    },

    openEquiplist() {
      this.equiplist_open = true;
    },

    closeEquiplist() {
      this.equiplist_open = false;
    },

    openCustomItem() {
      const slot = this.equipSlotToItemSlot(this.active_slot);
      if (slot !== 'quicksets') {
        this.custom_item.slot = slot;
      }
      this.custom_item_open = true;
    },

    closeCustomItem() {
      this.custom_item.id = null;
      this.custom_item.title = null;
      this.custom_item.slot = null;
      this.custom_item.sockets = [null, null, null];
      this.custom_item.int = null;
      this.custom_item.spi = null;
      this.custom_item.sp = null;
      this.custom_item.sp_fire = null;
      this.custom_item.sp_frost = null;
      this.custom_item.sp_arcane = null;
      this.custom_item.crit = null;
      this.custom_item.hit = null;
      this.custom_item.haste = null;
      this.custom_item.mp5 = null;
      this.custom_item.twohand = false;
      this.custom_item_open = false;
      this.custom_item_error = null;
    },

    addCustomItem() {
      this.custom_item_error = null;

      try {
        if (!this.custom_item.slot) {
          throw 'Choose a slot';
        }
        if (!this.custom_item.title) {
          throw 'Enter a title';
        }
        if (this.custom_item.id && this.findItem(this.custom_item.id)) {
          throw 'Item id already exists';
        }
      } catch (e) {
        this.custom_item_error = e;
        return;
      }

      const item = _.clone(this.custom_item);
      item.custom = true;
      if (item.slot !== 'weapon' || !item.twohand) {
        delete item.twohand;
      }
      delete item.slot;

      if (!item.id) {
        item.id = this.createItemId();
      }

      item.sockets = [];
      for (let i = 0; i < this.custom_item.sockets; i += 1) {
        item.sockets.push('r');
      }

      for (const key in item) {
        if (!item[key]) {
          delete item[key];
        }
      }

      this.items.equip[this.custom_item.slot].push(item);
      this.saveCustomItems();
      this.closeCustomItem();

      this.$nextTick(function () {
        this.refreshTooltips();
      });
    },

    deleteCustomItem(item) {
      const index = _.findIndex(this.items.equip[this.active_slot], { id: item.id });
      if (index !== -1) {
        if (this.isEquipped(this.active_slot, item.id)) {
          this.unequip(this.active_slot);
        }
        this.items.equip[this.active_slot].splice(index, 1);
        this.saveCustomItems();
      }
    },

    customItems() {
      const customItems = {};

      for (const slot in this.items.equip) {
        const arr = this.items.equip[slot].filter((item) => item.custom);
        if (arr.length) {
          customItems[slot] = arr;
        }
      }

      return customItems;
    },

    createItemId() {
      let id;
      while (true) {
        id = 100000 + Math.round(Math.random() * 500000);
        if (!this.findItem(id)) {
          return id;
        }
      }
    },

    showLog(log) {
      return this.log_filter[log.type];
    },

    configToggle() {
      this.timeline_open = false;
      this.spells_open = false;
      this.histogram_open = false;
      this.log_open = false;
      this.config_open = !this.config_open;
      if (!this.config_open) {
        this.saveConfig();
        this.finalStats();
      }
    },

    logToggle() {
      this.timeline_open = false;
      this.spells_open = false;
      this.histogram_open = false;
      this.config_open = false;
      this.log_open = !this.log_open;
    },

    histogramToggle() {
      this.log_open = false;
      this.config_open = false;
      this.timeline_open = false;
      this.spells_open = false;
      this.histogram_open = !this.histogram_open;
    },

    timelineToggle() {
      this.log_open = false;
      this.config_open = false;
      this.histogram_open = false;
      this.spells_open = false;
      this.timeline_open = !this.timeline_open;
    },

    spellsToggle() {
      this.log_open = false;
      this.config_open = false;
      this.histogram_open = false;
      this.timeline_open = false;
      this.spells_open = !this.spells_open;
    },

    allResults() {
      const a = document.createElement('a');
      a.href = `data:text/csv,${encodeURIComponent(this.result.all_results)}`;
      a.download = 'simdata.csv';
      a.click();
    },

    refreshTooltips() {
      if (window.$WowheadPower) {
        window.$WowheadPower.refreshLinks();
        this.$nextTick(() => {
          window.$WowheadPower.refreshLinks();
        });
      }
    },

    convertEnchants(enchants) {
      for (const slot in enchants) {
        enchants[slot] = this.convertEnchant(enchants[slot]);
      }

      return enchants;
    },

    convertEnchant(id) {
      if (!id) {
        return id;
      }

      const map = {
        46540: 27981,
        46538: 27982,
        46533: 27975,
        46532: 27968,
        46502: 27960,
        46504: 33990,
        46498: 27917,
        46496: 34001,
        46497: 27913,
        46514: 33997,
        46516: 33994,
        46512: 33993,
        46470: 34008,
        46518: 27924,
      };

      id = _.toString(id);
      if (Object.prototype.hasOwnProperty.call(map, id)) {
        id = map[id];
      }

      return parseInt(id, 10);
    },

    convertGems(gems) {
      for (const slot in gems) {
        gems[slot] = this.convertGemsSlot(slot, gems[slot]);
      }

      return gems;
    },

    convertGemsSlot(slot, gems) {
      if (!this.hasSocketBonus(slot, gems)) {
        const item = this.equippedItem(slot);
        if (!item) {
          return gems;
        }
        const n = item.sockets ? item.sockets.length - 1 : 0;
        const arr = _.clone(gems);
        for (let i = 0; i < n; i += 1) {
          arr.splice(n, 0, arr.splice(0, 1)[0]);
          if (this.hasSocketBonus(slot, arr)) {
            return arr;
          }
        }
      }

      return gems;
    },

    saveGear() {
      window.localStorage.setItem('magesim_tbc_equipped', JSON.stringify(this.equipped));
      window.localStorage.setItem('magesim_tbc_enchants', JSON.stringify(this.enchants));
      window.localStorage.setItem('magesim_tbc_gems', JSON.stringify(this.gems));
    },

    loadGear() {
      let equipped; let enchants; let
        gems;

      let str = window.localStorage.getItem('magesim_tbc_equipped');
      if (str) {
        equipped = JSON.parse(str);
        if (equipped) {
          _.merge(this.equipped, _.pick(equipped, _.keys(this.equipped)));
        }
      }

      str = window.localStorage.getItem('magesim_tbc_enchants');
      if (str) {
        enchants = JSON.parse(str);
        if (enchants) {
          enchants = this.convertEnchants(enchants);
          _.merge(this.enchants, _.pick(enchants, _.keys(this.enchants)));
        }
      }

      str = window.localStorage.getItem('magesim_tbc_gems');
      if (str) {
        gems = JSON.parse(str);
        if (gems) {
          gems = this.convertGems(gems);
          _.merge(this.gems, _.pick(gems, _.keys(this.gems)));
        }
      }

      if (!equipped) {
        this.quickset(this.items.quicksets.t5_arcane_bis);
      }
    },

    saveConfig() {
      window.localStorage.setItem('magesim_tbc_config', JSON.stringify(this.config));
    },

    loadConfig() {
      const str = window.localStorage.getItem('magesim_tbc_config');
      if (str) {
        const config = JSON.parse(str);
        if (config) {
          _.merge(this.config, _.pick(config, _.keys(this.config)));
          this.onLoadConfig(config);
        }
      }
    },

    // Backwards compatibility
    onLoadConfig(cfg) {
      this.config.talents = this.conformTalents(this.config.talents);

      const timings = [
        'trinket1', 'trinket2',
        'presence_of_mind', 'arcane_power',
        'icy_veins', 'cold_snap',
        'combustion', 'berserking',
        'drums', 'bloodlust',
        'mana_tide', 'power_infusion',
        'innervate',
        'potion', 'conjured',
      ];

      if (_.get(cfg, 'innervate_at') === 0) {
        delete cfg.innervate_at;
      }
      if (_.get(cfg, 'conjured_at') === 0 && cfg.conjured === this.conjureds.CONJURED_MANA_GEM) {
        delete cfg.conjured_at;
      }

      if (_.get(cfg, 'spec') === 1) {
        // Fire spec
        if (_.get(cfg, 'fire_rotation') === 1) {
          this.config.main_rotation = this.main_rotations.MAIN_ROTATION_SC;
        } else {
          this.config.main_rotation = this.main_rotations.MAIN_ROTATION_FIB;
        }
      } else if (_.get(cfg, 'spec') === 2) {
        // Frost spec
        this.config.main_rotation = this.main_rotations.MAIN_ROTATION_FRB;
      } else if (!Object.prototype.hasOwnProperty.call(cfg, 'main_rotation')) {
        // Arcane spec
        this.config.main_rotation = this.main_rotations.MAIN_ROTATION_AB;
      }

      if (!Object.prototype.hasOwnProperty.call(cfg, 'targets')) {
        this.config.targets = 1;
      }

      let from; let
        to;
      for (let i = 0; i < timings.length; i += 1) {
        to = `${timings[i]}_t`;

        from = `${timings[i]}_at`;
        if (Object.prototype.hasOwnProperty.call(cfg, from)) {
          this.config[to][0] = cfg[from];
        }

        from = `${timings[i]}_reuse_at`;
        if (Object.prototype.hasOwnProperty.call(cfg, from)) {
          this.config[to][1] = cfg[from];
        }
      }
    },

    saveProfiles() {
      window.localStorage.setItem('magesim_tbc_profiles', JSON.stringify(this.profiles));
    },

    loadProfiles() {
      const str = window.localStorage.getItem('magesim_tbc_profiles');
      if (str) {
        const profiles = JSON.parse(str);
        if (profiles) {
          this.profiles = profiles;
        }
      }
    },

    saveCustomItems() {
      window.localStorage.setItem('magesim_tbc_custom_items', JSON.stringify(this.customItems()));
    },

    loadCustomItems() {
      const str = window.localStorage.getItem('magesim_tbc_custom_items');
      if (str) {
        const customItems = JSON.parse(str);
        if (customItems) {
          for (const slot in customItems) {
            for (let i = 0; i < customItems[slot].length; i += 1) {
              this.items.equip[slot].push(customItems[slot][i]);
            }
          }
        }
      }
    },
  },
};
</script>
