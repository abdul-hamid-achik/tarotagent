export interface TarotCard {
  id: number
  name: string
  numeral: string
  image: string
  keywords: string[]
  uprightMeaning: string
  reversedMeaning: string
  description: string
}

export interface DrawnCard extends TarotCard {
  reversed: boolean
  position: string
}

export type SpreadType = 'single' | 'yes-no' | 'three-card' | 'love' | 'career' | 'celtic-cross'

export interface SpreadDefinition {
  name: string
  description: string
  positions: string[]
  readingGuide: string
}

export const spreadDefinitions: Record<SpreadType, SpreadDefinition> = {
  single: {
    name: 'Single Card',
    description: 'A focused pull for clarity on one question',
    positions: ['Significance'],
    readingGuide:
      'This is a single card pull. Go deep. Explore every facet of this one card — its symbolism, its energy, its shadows and light — as it relates to the question. A single card deserves the same depth as a full spread. Treat it like a meditation, not a summary.',
  },
  'yes-no': {
    name: 'Yes or No',
    description: 'A direct answer with nuance',
    positions: ['Answer'],
    readingGuide:
      'The querent seeks a yes-or-no answer. Begin with a clear lean — yes, no, or "not yet" — based on the card\'s energy and orientation. Then unpack the why. Upright cards generally lean yes; reversed lean no, but context and the specific card matter more than a rigid rule. Be direct first, then add depth.',
  },
  'three-card': {
    name: 'Three Card',
    description: 'Past, present, and future',
    positions: ['Past', 'Present', 'Future'],
    readingGuide:
      'Read as a narrative arc: the Past card sets the stage and shows what brought the querent here. The Present card reveals the current energy and tension. The Future card shows where this trajectory leads. The power is in the movement between them — show how one flows into the next.',
  },
  love: {
    name: 'Love',
    description: 'Relationship dynamics and potential',
    positions: ['You', 'The Other', 'The Connection', 'The Challenge', 'The Potential'],
    readingGuide:
      'Read the first two cards as mirrors of each person\'s energy. The Connection card reveals what binds or stands between them. The Challenge is the friction point — not necessarily negative, but where growth is required. The Potential shows what this relationship can become if the challenge is met honestly. Be compassionate but truthful; never promise outcomes in matters of the heart.',
  },
  career: {
    name: 'Career Path',
    description: 'Professional direction and obstacles',
    positions: [
      'Current Position',
      'The Obstacle',
      'Hidden Influence',
      'The Action',
      'The Outcome',
    ],
    readingGuide:
      'Read this as a strategic map. Current Position shows where the querent truly stands (not where they think they stand). The Obstacle is what blocks progress. Hidden Influence reveals an unseen force — a person, a belief, or a circumstance operating beneath the surface. The Action is what must be done. The Outcome shows the result of taking (or ignoring) that action. Be pragmatic and grounded.',
  },
  'celtic-cross': {
    name: 'Celtic Cross',
    description: 'The classic deep-dive spread',
    positions: [
      'Present',
      'Challenge',
      'Foundation',
      'Recent Past',
      'Crown',
      'Near Future',
      'Self',
      'Environment',
      'Hopes & Fears',
      'Outcome',
    ],
    readingGuide:
      'This is the most complete spread. Read it in two phases: First, the cross (cards 1-6) tells the story — Present and Challenge are the core tension, Foundation is the root cause, Recent Past is what\'s fading, Crown is the conscious goal, Near Future is the next chapter. Then the staff (cards 7-10) reveals the deeper truth — Self is the querent\'s inner state, Environment is external forces, Hopes & Fears (often the same thing) reveals what drives them, and Outcome is the culmination. Weave both phases into one unified narrative.',
  },
}

export const majorArcana: TarotCard[] = [
  {
    id: 0,
    name: 'The Fool',
    numeral: '0',
    image: '/cards/00-the-fool.png',
    keywords: ['beginnings', 'innocence', 'spontaneity', 'free spirit'],
    uprightMeaning:
      'The Fool represents new beginnings, having faith in the future, and embracing the unknown with open arms. It signals a time to take a leap of faith and trust the journey ahead. This card encourages you to follow your heart even if the path seems unconventional.',
    reversedMeaning:
      'Reversed, The Fool warns of recklessness, poor judgment, and naivety. You may be taking unnecessary risks without considering the consequences. It can also indicate holding back from a new experience out of fear.',
    description:
      'A young figure stands at the edge of a cliff, gazing upward at the sky with a small white dog at their feet. They carry a small bundle on a staff over one shoulder, a white rose in the other hand.',
  },
  {
    id: 1,
    name: 'The Magician',
    numeral: 'I',
    image: '/cards/01-the-magician.png',
    keywords: ['manifestation', 'willpower', 'resourcefulness', 'skill'],
    uprightMeaning:
      'The Magician signifies that you have all the tools and resources you need to manifest your desires. It is a card of action, concentration, and personal power. Now is the time to channel your energy and make things happen.',
    reversedMeaning:
      'Reversed, The Magician suggests manipulation, trickery, or untapped potential. You may be using your talents for deceptive purposes, or you may not be utilizing your full capabilities. Beware of illusions and misdirection.',
    description:
      'A robed figure stands before a table bearing a cup, pentacle, sword, and wand. One hand points to the sky, the other to the earth. An infinity symbol floats above their head, surrounded by a garden of roses and lilies.',
  },
  {
    id: 2,
    name: 'The High Priestess',
    numeral: 'II',
    image: '/cards/02-the-high-priestess.png',
    keywords: ['intuition', 'mystery', 'subconscious', 'inner voice'],
    uprightMeaning:
      'The High Priestess calls you to listen to your inner voice and trust your intuition. She guards the threshold between the conscious and subconscious mind. Secrets may soon be revealed, and wisdom comes from looking within rather than seeking external validation.',
    reversedMeaning:
      'Reversed, The High Priestess indicates that you are ignoring your intuition or that hidden information is being withheld. You may feel disconnected from your inner self. It can also suggest secrets, gossip, or superficial knowledge.',
    description:
      'A serene woman sits between two pillars, one black and one white, with a crescent moon at her feet. She holds a scroll partially concealed by her robe, and a veil adorned with pomegranates hangs behind her.',
  },
  {
    id: 3,
    name: 'The Empress',
    numeral: 'III',
    image: '/cards/03-the-empress.png',
    keywords: ['abundance', 'nurturing', 'fertility', 'nature'],
    uprightMeaning:
      'The Empress embodies abundance, beauty, and the nurturing force of nature. She signals a period of growth, creativity, and sensual pleasure. This card encourages you to connect with the natural world and embrace the feminine energy of creation and care.',
    reversedMeaning:
      'Reversed, The Empress can indicate creative blocks, dependence on others, or neglecting self-care. You may be smothering someone with attention or experiencing a lack of abundance. It warns against being overly possessive or losing touch with nature.',
    description:
      'A regal woman reclines on a throne of cushions in a lush garden. She wears a crown of twelve stars and a gown patterned with pomegranates. A field of golden wheat grows at her feet and a heart-shaped shield rests beside her.',
  },
  {
    id: 4,
    name: 'The Emperor',
    numeral: 'IV',
    image: '/cards/04-the-emperor.png',
    keywords: ['authority', 'structure', 'stability', 'leadership'],
    uprightMeaning:
      'The Emperor represents authority, structure, and the power of discipline. He calls on you to take control of your situation and establish order. This card signifies leadership, strategic thinking, and the strength that comes from setting firm boundaries.',
    reversedMeaning:
      'Reversed, The Emperor warns of tyranny, rigidity, or an abuse of power. You may be struggling with authority figures or imposing excessive control on others. It can also suggest a lack of discipline or feeling powerless in a situation.',
    description:
      'A stern figure sits upon a stone throne carved with ram heads, wearing armor beneath a red robe. He holds an ankh scepter in one hand and an orb in the other. Barren mountains rise behind him under an orange sky.',
  },
  {
    id: 5,
    name: 'The Hierophant',
    numeral: 'V',
    image: '/cards/05-the-hierophant.png',
    keywords: ['tradition', 'conformity', 'wisdom', 'spiritual guidance'],
    uprightMeaning:
      'The Hierophant represents spiritual wisdom, tradition, and established institutions. He encourages you to seek guidance from a mentor or follow a well-trodden path. This card speaks to the value of shared beliefs, rituals, and the wisdom passed down through generations.',
    reversedMeaning:
      'Reversed, The Hierophant signals rebellion against convention, unorthodox approaches, or questioning established beliefs. You may feel constrained by tradition or be seeking your own spiritual path. It can also indicate a poor counselor or outdated advice.',
    description:
      'A religious figure in ornate vestments sits between two grey pillars, raising one hand in blessing while holding a triple-cross staff. Two acolytes kneel before him, and two crossed keys rest at his feet.',
  },
  {
    id: 6,
    name: 'The Lovers',
    numeral: 'VI',
    image: '/cards/06-the-lovers.png',
    keywords: ['love', 'harmony', 'partnerships', 'choices'],
    uprightMeaning:
      'The Lovers card speaks to deep connections, harmony, and meaningful choices. Beyond romantic love, it represents alignment of values and the union of opposites. A significant decision lies before you, one that requires you to follow your heart while staying true to your principles.',
    reversedMeaning:
      'Reversed, The Lovers warn of disharmony, imbalance, or misaligned values in a relationship. You may be facing a difficult choice where neither option feels right. It can indicate self-love issues, broken trust, or a temptation that could lead you astray.',
    description:
      'Beneath a radiant angel, a man and woman stand naked in a garden. Behind the woman grows the Tree of Knowledge with a serpent; behind the man, the Tree of Life with twelve flames. A mountain rises between them.',
  },
  {
    id: 7,
    name: 'The Chariot',
    numeral: 'VII',
    image: '/cards/07-the-chariot.png',
    keywords: ['determination', 'willpower', 'triumph', 'control'],
    uprightMeaning:
      'The Chariot signifies victory through determination and willpower. You are being called to harness opposing forces and drive forward with confidence. This card represents overcoming obstacles, maintaining focus, and achieving success through sheer resolve and self-discipline.',
    reversedMeaning:
      'Reversed, The Chariot indicates a loss of control, aggression, or lack of direction. You may be feeling pulled in different directions or trying to force an outcome that is not aligned with your path. It warns of defeat through scattered energy or unchecked ambition.',
    description:
      'An armored figure rides a stone chariot drawn by one black and one white sphinx. A canopy of stars stretches above, and a city lies behind. The charioteer wears a crown and bears a square on the breastplate.',
  },
  {
    id: 8,
    name: 'Strength',
    numeral: 'VIII',
    image: '/cards/08-strength.png',
    keywords: ['courage', 'patience', 'compassion', 'inner strength'],
    uprightMeaning:
      'Strength represents inner courage, patience, and the quiet power of compassion. Rather than brute force, this card speaks to taming your inner beasts through gentleness and understanding. You have the resilience and emotional fortitude to face whatever challenges arise.',
    reversedMeaning:
      'Reversed, Strength suggests self-doubt, insecurity, or raw, unchecked emotions. You may be lacking confidence or letting fear and anxiety overpower your better judgment. It can also indicate an abuse of power or an inability to control destructive impulses.',
    description:
      'A woman gently holds open the jaws of a lion, an infinity symbol hovering above her head. She wears a white robe and a garland of flowers, standing in a verdant meadow beneath a golden sky.',
  },
  {
    id: 9,
    name: 'The Hermit',
    numeral: 'IX',
    image: '/cards/09-the-hermit.png',
    keywords: ['introspection', 'solitude', 'wisdom', 'inner guidance'],
    uprightMeaning:
      'The Hermit calls you to withdraw from the noise of the world and seek answers within. This is a time for introspection, contemplation, and soul-searching. The wisdom you seek cannot be found externally; it resides in the quiet stillness of your own inner light.',
    reversedMeaning:
      'Reversed, The Hermit warns of isolation, loneliness, or withdrawal taken to an extreme. You may be shutting others out or refusing guidance when you need it most. It can also suggest that your period of reflection is complete and it is time to re-engage with the world.',
    description:
      'A cloaked elder stands atop a snow-covered mountain, holding a lantern containing a six-pointed star in one hand and a long staff in the other. The figure gazes downward into the darkness below.',
  },
  {
    id: 10,
    name: 'Wheel of Fortune',
    numeral: 'X',
    image: '/cards/10-wheel-of-fortune.png',
    keywords: ['cycles', 'destiny', 'change', 'luck'],
    uprightMeaning:
      'The Wheel of Fortune signals a turning point, a shift in fate, and the cyclical nature of life. Good luck and positive change are on the horizon. This card reminds you that nothing is permanent and encourages you to embrace the ebb and flow of fortune with grace.',
    reversedMeaning:
      'Reversed, the Wheel of Fortune suggests bad luck, resistance to change, or being stuck in a negative cycle. You may feel that external forces are working against you. It warns against clinging to the past and encourages you to break free from repeating patterns.',
    description:
      'A great golden wheel floats among clouds, inscribed with alchemical symbols and the letters T-A-R-O. Four winged creatures sit in the corners reading books, while a sphinx perches atop the wheel and a serpent descends its side.',
  },
  {
    id: 11,
    name: 'Justice',
    numeral: 'XI',
    image: '/cards/11-justice.png',
    keywords: ['fairness', 'truth', 'accountability', 'law'],
    uprightMeaning:
      'Justice calls for truth, fairness, and accountability. The consequences of past actions are coming to bear, and balance must be restored. This card urges you to make decisions with clarity and integrity, knowing that the universe seeks equilibrium in all things.',
    reversedMeaning:
      'Reversed, Justice indicates dishonesty, unfairness, or a refusal to accept accountability. Legal matters may not go in your favor, or you may be avoiding the consequences of your actions. It warns of bias, corruption, or an unjust situation.',
    description:
      'A crowned figure sits on a stone throne between two pillars, holding a double-edged sword upright in one hand and a set of balanced scales in the other. A purple veil hangs behind the throne.',
  },
  {
    id: 12,
    name: 'The Hanged Man',
    numeral: 'XII',
    image: '/cards/12-the-hanged-man.png',
    keywords: ['surrender', 'new perspective', 'sacrifice', 'letting go'],
    uprightMeaning:
      'The Hanged Man invites you to pause, surrender, and see the world from a new perspective. This is not a card of punishment but of willing sacrifice and spiritual insight. By letting go of control and embracing stillness, profound understanding and transformation become possible.',
    reversedMeaning:
      'Reversed, The Hanged Man suggests resistance to necessary sacrifice, stalling, or martyrdom. You may be refusing to let go of something that no longer serves you, or delaying an inevitable decision. It can also indicate unnecessary suffering or a victim mentality.',
    description:
      'A figure hangs upside down from a living tree by one foot, the other leg crossed behind the knee. A golden halo surrounds their serene face, and their hands are hidden behind their back.',
  },
  {
    id: 13,
    name: 'Death',
    numeral: 'XIII',
    image: '/cards/13-death.png',
    keywords: ['transformation', 'endings', 'renewal', 'transition'],
    uprightMeaning:
      'Death signals a profound transformation, the end of one chapter and the beginning of another. This card rarely means literal death; instead, it speaks to necessary endings that make way for new growth. Embrace the change, for resisting it will only prolong the transition.',
    reversedMeaning:
      'Reversed, Death indicates resistance to change, stagnation, or fear of letting go. You may be clinging to old patterns, relationships, or identities that have run their course. Personal transformation is being delayed by your refusal to release what is no longer serving you.',
    description:
      'A skeletal figure in black armor rides a white horse through a field where people of all stations have fallen. A bishop approaches with hands clasped in prayer. In the distance, the sun rises between two towers.',
  },
  {
    id: 14,
    name: 'Temperance',
    numeral: 'XIV',
    image: '/cards/14-temperance.png',
    keywords: ['balance', 'moderation', 'patience', 'harmony'],
    uprightMeaning:
      'Temperance calls for balance, patience, and moderation in all things. It speaks to the art of blending opposites into a harmonious whole. This card encourages you to take the middle path, practice self-restraint, and trust that the right outcome will unfold in its own time.',
    reversedMeaning:
      'Reversed, Temperance warns of excess, imbalance, or a lack of harmony. You may be overindulging, rushing into things, or struggling to find your center. It can indicate conflict between different areas of your life or a need to realign your priorities.',
    description:
      'A winged angel stands with one foot on land and one in water, pouring liquid between two golden cups. A path winds from the water toward distant mountains where a golden crown floats above twin peaks. Irises bloom at the water\'s edge.',
  },
  {
    id: 15,
    name: 'The Devil',
    numeral: 'XV',
    image: '/cards/15-the-devil.png',
    keywords: ['bondage', 'materialism', 'shadow self', 'attachment'],
    uprightMeaning:
      'The Devil represents the shadow side: bondage, addiction, and unhealthy attachments. It reveals the chains that bind you, often of your own making. This card challenges you to confront your deepest fears and dependencies, recognizing that the power to free yourself has always been within you.',
    reversedMeaning:
      'Reversed, The Devil signals a release from bondage, breaking free of addictions, or reclaiming your power. You are beginning to see through illusions and recognize the self-imposed limitations that have held you back. Liberation and personal empowerment are at hand.',
    description:
      'A horned, bat-winged figure crouches on a dark pedestal to which a naked man and woman are loosely chained. Both figures have small horns and tails. An inverted pentagram blazes above the devil\'s head.',
  },
  {
    id: 16,
    name: 'The Tower',
    numeral: 'XVI',
    image: '/cards/16-the-tower.png',
    keywords: ['upheaval', 'revelation', 'sudden change', 'liberation'],
    uprightMeaning:
      'The Tower heralds sudden upheaval, destruction of false structures, and revelations that shake your foundations. While this can feel devastating, it clears away what was built on unstable ground. From the rubble, you can rebuild something stronger, truer, and more aligned with reality.',
    reversedMeaning:
      'Reversed, The Tower suggests you are resisting necessary change or that a disaster has been narrowly avoided. You may be aware that something in your life is unsustainable but are clinging to it anyway. It can also indicate a personal transformation happening internally rather than externally.',
    description:
      'Lightning strikes a tall stone tower on a rocky peak, shattering its crown. Two figures plummet through the air amid falling flames and debris. Dark clouds swirl around the burning structure against a black sky.',
  },
  {
    id: 17,
    name: 'The Star',
    numeral: 'XVII',
    image: '/cards/17-the-star.png',
    keywords: ['hope', 'inspiration', 'renewal', 'serenity'],
    uprightMeaning:
      'The Star shines as a beacon of hope, inspiration, and spiritual renewal after a period of darkness. It signals a time of healing, peace, and reconnection with your higher self. Trust that the universe is guiding you toward your purpose, and let your inner light radiate outward.',
    reversedMeaning:
      'Reversed, The Star indicates a loss of faith, discouragement, or disconnection from your spiritual path. You may be feeling uninspired, hopeless, or unable to see the light at the end of the tunnel. It urges you to reconnect with what gives your life meaning and purpose.',
    description:
      'A nude figure kneels by a pool of water beneath a sky of eight radiant stars, pouring water from two pitchers onto the land and into the pool. A bird perches in a tree behind her. The landscape is lush and open.',
  },
  {
    id: 18,
    name: 'The Moon',
    numeral: 'XVIII',
    image: '/cards/18-the-moon.png',
    keywords: ['illusion', 'fear', 'subconscious', 'intuition'],
    uprightMeaning:
      'The Moon reveals the realm of illusion, fear, and the deep subconscious. Things are not as they seem, and confusion or deception may cloud your judgment. This card calls you to trust your intuition, face your fears, and navigate through uncertainty with inner knowing rather than logic alone.',
    reversedMeaning:
      'Reversed, The Moon suggests that illusions are being dispelled and clarity is returning. Fears and anxieties that once paralyzed you are losing their grip. It can also indicate repressed emotions surfacing or the release of subconscious patterns that have held you captive.',
    description:
      'A full moon gazes down between two towers as a winding path leads from a pool of water into distant mountains. A crayfish emerges from the pool while a dog and a wolf howl at the moon from either side of the path.',
  },
  {
    id: 19,
    name: 'The Sun',
    numeral: 'XIX',
    image: '/cards/19-the-sun.png',
    keywords: ['joy', 'success', 'vitality', 'optimism'],
    uprightMeaning:
      'The Sun radiates pure joy, success, and vitality. It is one of the most positive cards in the deck, signaling a time of happiness, clarity, and achievement. Everything is coming together, and you are free to express your true self with confidence and enthusiasm.',
    reversedMeaning:
      'Reversed, The Sun may indicate temporary setbacks, diminished joy, or an overly optimistic outlook that ignores reality. You may be struggling to see the bright side or experiencing delays in achieving your goals. The happiness you seek is still available but may require more effort to reach.',
    description:
      'A radiant sun beams down on a joyful child riding a white horse through a garden of sunflowers. The child holds a red banner aloft, and the horse wears a garland of flowers. A stone wall stands behind them.',
  },
  {
    id: 20,
    name: 'Judgement',
    numeral: 'XX',
    image: '/cards/20-judgement.png',
    keywords: ['rebirth', 'reckoning', 'absolution', 'inner calling'],
    uprightMeaning:
      'Judgement calls you to rise up, heed your inner calling, and embrace a spiritual rebirth. It is a time of reckoning, self-evaluation, and answering a higher purpose. Past experiences have prepared you for this moment of transformation; answer the call with courage and clarity.',
    reversedMeaning:
      'Reversed, Judgement suggests self-doubt, an ignored calling, or an inability to learn from past mistakes. You may be avoiding a necessary reckoning or refusing to forgive yourself or others. It warns against harsh self-judgment and encourages compassion in your self-evaluation.',
    description:
      'An angel blows a great trumpet from the clouds as figures rise from open coffins with arms outstretched. Men, women, and children emerge from grey tombs, their faces turned upward toward the heavens. Snow-capped mountains frame the background.',
  },
  {
    id: 21,
    name: 'The World',
    numeral: 'XXI',
    image: '/cards/21-the-world.png',
    keywords: ['completion', 'integration', 'accomplishment', 'wholeness'],
    uprightMeaning:
      'The World represents completion, accomplishment, and the fulfillment of a major life cycle. You have reached a point of wholeness and integration, having learned the lessons this journey had to offer. Celebrate your achievements and prepare for the next cycle of growth to begin.',
    reversedMeaning:
      'Reversed, The World indicates incomplete goals, shortcuts, or a lack of closure. You may be so close to finishing something but feel stuck at the final hurdle. It can also suggest that you are seeking fulfillment externally when true wholeness must come from within.',
    description:
      'A dancing figure is encircled by a great laurel wreath, holding a wand in each hand. The four creatures of the evangelists occupy the corners: an angel, an eagle, a bull, and a lion. Purple ribbons bind the wreath at top and bottom.',
  },
]
