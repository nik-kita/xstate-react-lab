import { createActor } from 'xstate';
import { machine } from '../src/game/machine.ts';
import { assertEquals } from "https://deno.land/std@0.211.0/assert/assert_equals.ts";


Deno.test('GameMachine one', () => {
  const game = createActor(machine);

  const s1 = game.getSnapshot();

  assertEquals(s1.value, 'Tetromino_creation');
});

