import { spreadDefinitions } from '../../shared/tarot'
import type { DrawnCard, SpreadDefinition, SpreadType, TarotCard } from '../../shared/tarot'

export { spreadDefinitions }
export type { DrawnCard, SpreadDefinition, SpreadType, TarotCard }

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
      "A winged angel stands with one foot on land and one in water, pouring liquid between two golden cups. A path winds from the water toward distant mountains where a golden crown floats above twin peaks. Irises bloom at the water's edge.",
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
      "A horned, bat-winged figure crouches on a dark pedestal to which a naked man and woman are loosely chained. Both figures have small horns and tails. An inverted pentagram blazes above the devil's head.",
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

// Tarot asset contract:
// - public/cards/back.png is the shared face-down card cover.
// - public/cards/00-... through 77-... are 128x180 PNGs matching the UI 32:45 ratio.
// - IDs 00-21 are Major Arcana; IDs 22-77 follow this suit/rank order.
// Keep this order and cardImagePath() aligned with the generated asset filenames.
const minorSuits = [
  {
    name: 'Wands',
    slug: 'wands',
  },
  {
    name: 'Cups',
    slug: 'cups',
  },
  {
    name: 'Swords',
    slug: 'swords',
  },
  {
    name: 'Pentacles',
    slug: 'pentacles',
  },
] as const

const minorRanks = [
  {
    name: 'Ace',
    slug: 'ace',
    numeral: 'Ace',
  },
  {
    name: 'Two',
    slug: 'two',
    numeral: 'II',
  },
  {
    name: 'Three',
    slug: 'three',
    numeral: 'III',
  },
  {
    name: 'Four',
    slug: 'four',
    numeral: 'IV',
  },
  {
    name: 'Five',
    slug: 'five',
    numeral: 'V',
  },
  {
    name: 'Six',
    slug: 'six',
    numeral: 'VI',
  },
  {
    name: 'Seven',
    slug: 'seven',
    numeral: 'VII',
  },
  {
    name: 'Eight',
    slug: 'eight',
    numeral: 'VIII',
  },
  {
    name: 'Nine',
    slug: 'nine',
    numeral: 'IX',
  },
  {
    name: 'Ten',
    slug: 'ten',
    numeral: 'X',
  },
  {
    name: 'Page',
    slug: 'page',
    numeral: 'Page',
  },
  {
    name: 'Knight',
    slug: 'knight',
    numeral: 'Knight',
  },
  {
    name: 'Queen',
    slug: 'queen',
    numeral: 'Queen',
  },
  {
    name: 'King',
    slug: 'king',
    numeral: 'King',
  },
] as const

type MinorCardDetails = Pick<
  TarotCard,
  'keywords' | 'uprightMeaning' | 'reversedMeaning' | 'description'
>

const minorCardDetails: Record<string, MinorCardDetails> = {
  'ace-of-wands': {
    keywords: ['inspiration', 'potential', 'creation', 'spark'],
    uprightMeaning:
      'The Ace of Wands brings a flash of creative fire. A new idea, desire, or path is asking to be acted on before it cools. This is raw potential, not a finished plan, and it needs courage more than certainty.',
    reversedMeaning:
      'Reversed, the Ace of Wands shows a spark being smothered by hesitation, burnout, or scattered attention. The desire is real, but the channel for it is blocked or being forced before it has enough air.',
    description:
      'A single budding wand blazes with a small flame above a castle road, held like a sacred torch at the beginning of a quest.',
  },
  'two-of-wands': {
    keywords: ['planning', 'choice', 'vision', 'threshold'],
    uprightMeaning:
      'The Two of Wands stands at the balcony with the world in hand. It asks for vision, planning, and the courage to choose a direction before the gate opens.',
    reversedMeaning:
      'Reversed, the Two of Wands can show fear of leaving the familiar, plans made too small, or ambition that has no real path beneath it.',
    description:
      'A cloaked figure surveys the horizon between two staffs, weighing a future that is close enough to choose but not yet entered.',
  },
  'three-of-wands': {
    keywords: ['expansion', 'foresight', 'progress', 'waiting'],
    uprightMeaning:
      'The Three of Wands shows the first response from a choice already made. Plans are moving beyond your direct control, and patience now matters as much as initiative.',
    reversedMeaning:
      'Reversed, the Three of Wands warns of delayed returns, narrow horizons, or plans that were sent out before their foundations were steady.',
    description:
      'Three planted wands frame a watcher looking toward ships and sunrise, waiting for effort to return as opportunity.',
  },
  'four-of-wands': {
    keywords: ['celebration', 'homecoming', 'stability', 'belonging'],
    uprightMeaning:
      'The Four of Wands marks a threshold of welcome. It brings celebration, temporary shelter, and the relief of arriving somewhere that can hold joy.',
    reversedMeaning:
      'Reversed, the Four of Wands suggests unstable foundations, delayed celebration, or belonging that feels conditional rather than secure.',
    description:
      'Four flowered staves make a garlanded gate before a warm courtyard where celebration gathers.',
  },
  'five-of-wands': {
    keywords: ['competition', 'friction', 'conflict', 'testing'],
    uprightMeaning:
      'The Five of Wands brings heat without a clear center. Rival desires, voices, or priorities collide, but the struggle can train strength if it does not become vanity.',
    reversedMeaning:
      'Reversed, the Five of Wands can show conflict avoided until it festers, or the first easing after needless competition has exhausted itself.',
    description:
      'Five figures cross their staves in a noisy contest, more chaotic than cruel, beneath a restless red sky.',
  },
  'six-of-wands': {
    keywords: ['victory', 'recognition', 'confidence', 'arrival'],
    uprightMeaning:
      'The Six of Wands is public recognition after a hard push. It asks you to accept the laurel without confusing praise for the whole journey.',
    reversedMeaning:
      'Reversed, the Six of Wands points to private doubt, hollow applause, delayed recognition, or pride that needs to be brought back to proportion.',
    description:
      'A rider carries a laurel-crowned wand through a city procession while other staves rise like banners.',
  },
  'seven-of-wands': {
    keywords: ['defense', 'persistence', 'pressure', 'conviction'],
    uprightMeaning:
      'The Seven of Wands asks you to hold your ground from the high place you earned. The pressure is real, but so is your advantage if you act from conviction rather than panic.',
    reversedMeaning:
      'Reversed, the Seven of Wands can show exhaustion, weak boundaries, or a battle being fought from reflex instead of purpose.',
    description:
      'A solitary defender raises one staff against six below, standing on uneven stone with no room for half-heartedness.',
  },
  'eight-of-wands': {
    keywords: ['speed', 'messages', 'movement', 'release'],
    uprightMeaning:
      'The Eight of Wands is movement after delay. Messages, decisions, or events travel quickly now, and the best response is clean direction rather than overcontrol.',
    reversedMeaning:
      'Reversed, the Eight of Wands warns of mixed signals, delays, haste, or energy flying in too many directions to land well.',
    description:
      'Eight flaming staves streak across the sky over a river valley, carrying momentum like arrows of fire.',
  },
  'nine-of-wands': {
    keywords: ['resilience', 'guardedness', 'endurance', 'boundaries'],
    uprightMeaning:
      'The Nine of Wands shows the survivor still standing. You are closer to the end than you feel, but vigilance must not become a prison.',
    reversedMeaning:
      'Reversed, the Nine of Wands suggests depletion, suspicion, or a refusal to lower defenses even when the danger has changed.',
    description:
      'A weary guard grips a staff before a wall of eight others, bandaged but alert under lantern light.',
  },
  'ten-of-wands': {
    keywords: ['burden', 'responsibility', 'completion', 'overload'],
    uprightMeaning:
      'The Ten of Wands carries the cost of saying yes too often. Completion is near, but the load needs honesty, delegation, or release.',
    reversedMeaning:
      'Reversed, the Ten of Wands shows burdens being dropped, resisted, or denied. Relief is possible, but only if pride stops calling overload devotion.',
    description:
      'A bent traveler carries ten heavy staves toward a town gate, close to arrival but nearly hidden by the weight.',
  },
  'page-of-wands': {
    keywords: ['curiosity', 'message', 'exploration', 'enthusiasm'],
    uprightMeaning:
      'The Page of Wands brings a message from the fire within. Curiosity is leading, and the first step matters more than mastery.',
    reversedMeaning:
      'Reversed, the Page of Wands can show scattered enthusiasm, immaturity, or an idea that keeps being announced but not practiced.',
    description:
      'A young messenger studies a budding staff as if it has begun speaking, bright with restless possibility.',
  },
  'knight-of-wands': {
    keywords: ['action', 'adventure', 'impulse', 'pursuit'],
    uprightMeaning:
      'The Knight of Wands charges toward desire. It brings courage, momentum, and bold pursuit, but it needs direction or it burns through what it meant to build.',
    reversedMeaning:
      'Reversed, the Knight of Wands warns of recklessness, volatility, impatience, or a quest driven by heat instead of purpose.',
    description:
      'An armored rider surges forward with a flaming staff and a wind-torn cloak, all motion and red-gold force.',
  },
  'queen-of-wands': {
    keywords: ['confidence', 'warmth', 'magnetism', 'creative power'],
    uprightMeaning:
      'The Queen of Wands owns her fire without apology. She brings confidence, creative command, and the power to attract by being fully alive.',
    reversedMeaning:
      'Reversed, the Queen of Wands can show jealousy, self-doubt, burnout, or charisma turned into control.',
    description:
      'A crowned queen holds a blooming staff beside a sunflower and watchful black cat, radiant and self-possessed.',
  },
  'king-of-wands': {
    keywords: ['leadership', 'vision', 'enterprise', 'mastery'],
    uprightMeaning:
      'The King of Wands turns vision into command. He asks for brave leadership, long-range thinking, and the maturity to direct fire without consuming the room.',
    reversedMeaning:
      'Reversed, the King of Wands warns of arrogance, impulsive authority, harsh expectations, or a vision imposed rather than shared.',
    description:
      'A king sits among salamander and lion emblems, holding a flowering wand like a scepter of mastered flame.',
  },
  'ace-of-cups': {
    keywords: ['love', 'opening', 'intuition', 'healing'],
    uprightMeaning:
      'The Ace of Cups opens the heart like a spring. It brings emotional renewal, intuition, compassion, and the first clean overflow of feeling.',
    reversedMeaning:
      'Reversed, the Ace of Cups shows feeling held back, grief unpoured, or a heart trying to protect itself from the very medicine it needs.',
    description:
      'A golden chalice overflows into lilies and water, offered beneath a quiet dove and silver-blue sky.',
  },
  'two-of-cups': {
    keywords: ['union', 'trust', 'agreement', 'mutuality'],
    uprightMeaning:
      'The Two of Cups is the meeting of two honest vessels. It favors mutual respect, reconciliation, affection, and agreements made eye to eye.',
    reversedMeaning:
      'Reversed, the Two of Cups points to imbalance, misalignment, old hurt between people, or a bond that needs truth before closeness.',
    description:
      'Two figures exchange chalices beneath a winged emblem, making a vow in a garden courtyard.',
  },
  'three-of-cups': {
    keywords: ['friendship', 'community', 'joy', 'support'],
    uprightMeaning:
      'The Three of Cups gathers joy in company. It speaks of friendship, celebration, chosen family, and the healing that comes from being witnessed.',
    reversedMeaning:
      'Reversed, the Three of Cups can show social strain, exclusion, gossip, overindulgence, or a need for quieter companionship.',
    description:
      'Three companions raise cups in a harvest garden, circling one another with laughter and abundance.',
  },
  'four-of-cups': {
    keywords: ['apathy', 'reflection', 'discontent', 'reconsideration'],
    uprightMeaning:
      'The Four of Cups sits with emotional fatigue. Something is being offered, but the heart may need stillness before it can recognize what is real.',
    reversedMeaning:
      'Reversed, the Four of Cups suggests re-engagement, a missed chance becoming visible, or the first willingness to lift your eyes.',
    description:
      'A seated figure studies three cups while a fourth is offered from mist, quiet and easy to overlook.',
  },
  'five-of-cups': {
    keywords: ['grief', 'regret', 'loss', 'reorientation'],
    uprightMeaning:
      'The Five of Cups honors grief but asks you not to mistake loss for the whole landscape. What has spilled matters, and what remains matters too.',
    reversedMeaning:
      'Reversed, the Five of Cups can show forgiveness, acceptance, or the painful moment when grief begins to loosen its grip.',
    description:
      'A black-cloaked figure mourns spilled chalices beside a river, with two upright cups waiting behind.',
  },
  'six-of-cups': {
    keywords: ['memory', 'kindness', 'innocence', 'return'],
    uprightMeaning:
      'The Six of Cups brings memory softened by kindness. It can show nostalgia, generosity, childhood patterns, or a return to what once felt simple.',
    reversedMeaning:
      'Reversed, the Six of Cups warns against living in the past, idealizing what was, or repeating old emotional roles.',
    description:
      'Flower-filled cups pass between children in a walled courtyard, gentle and sunlit with memory.',
  },
  'seven-of-cups': {
    keywords: ['illusion', 'choices', 'fantasy', 'temptation'],
    uprightMeaning:
      'The Seven of Cups fills the air with visions. Many options glitter, but not every image can become a life; discernment is the real task.',
    reversedMeaning:
      'Reversed, the Seven of Cups brings fog lifting, fantasy collapsing, or the pressure to choose after too long among beautiful distractions.',
    description:
      'Seven chalices float in cloud, each holding a different dream, while a seeker stands below in wonder and risk.',
  },
  'eight-of-cups': {
    keywords: ['departure', 'search', 'release', 'disillusionment'],
    uprightMeaning:
      'The Eight of Cups walks away from what is full enough to leave. It is the courage to seek deeper truth when comfort no longer feeds the soul.',
    reversedMeaning:
      'Reversed, the Eight of Cups suggests fear of leaving, returning too soon, or abandoning a path before understanding why it disappointed you.',
    description:
      'A cloaked traveler leaves stacked cups by moonlit water and follows a mountain path into the dark.',
  },
  'nine-of-cups': {
    keywords: ['satisfaction', 'pleasure', 'wish', 'contentment'],
    uprightMeaning:
      'The Nine of Cups is the glow of a wish fulfilled. It celebrates pleasure, gratitude, and the right to enjoy what has been earned.',
    reversedMeaning:
      'Reversed, the Nine of Cups warns of shallow satisfaction, excess, hidden emptiness, or wanting applause more than nourishment.',
    description:
      'A satisfied host sits before a row of golden cups, warm with comfort and self-contained delight.',
  },
  'ten-of-cups': {
    keywords: ['harmony', 'family', 'fulfillment', 'belonging'],
    uprightMeaning:
      'The Ten of Cups shows emotional completion shared with others. It favors peace, belonging, reconciliation, and the kind of joy that becomes shelter.',
    reversedMeaning:
      'Reversed, the Ten of Cups can show family strain, private unhappiness behind a bright image, or a dream of harmony that needs repair.',
    description:
      'A family stands under an arc of cups and rainbow light, with a river home glowing in the distance.',
  },
  'page-of-cups': {
    keywords: ['message', 'imagination', 'sensitivity', 'surprise'],
    uprightMeaning:
      'The Page of Cups arrives with a tender message. Intuition, apology, art, or affection may appear in a form that feels strange but sincere.',
    reversedMeaning:
      'Reversed, the Page of Cups suggests emotional immaturity, blocked creativity, moodiness, or a message the heart is afraid to send.',
    description:
      'A young messenger holds a chalice where a small fish appears, strange and gentle as intuition itself.',
  },
  'knight-of-cups': {
    keywords: ['romance', 'proposal', 'quest', 'idealism'],
    uprightMeaning:
      'The Knight of Cups follows the heart as a quest. He brings invitation, romance, artistry, and movement guided by feeling.',
    reversedMeaning:
      'Reversed, the Knight of Cups warns of charm without grounding, emotional avoidance, fantasy, or promises prettier than their follow-through.',
    description:
      'A silver rider carries a chalice beside slow water, offering feeling with ceremony and grace.',
  },
  'queen-of-cups': {
    keywords: ['empathy', 'intuition', 'care', 'depth'],
    uprightMeaning:
      'The Queen of Cups listens beneath words. She brings compassion, emotional wisdom, dream knowledge, and the strength of a well-held heart.',
    reversedMeaning:
      'Reversed, the Queen of Cups can show emotional overwhelm, porous boundaries, secrecy, or care that has forgotten the self.',
    description:
      'A sea-throned queen holds a covered chalice close, guarded and luminous with deep feeling.',
  },
  'king-of-cups': {
    keywords: ['emotional mastery', 'calm', 'wisdom', 'diplomacy'],
    uprightMeaning:
      'The King of Cups remains steady while the waters move. He asks for emotional maturity, compassion under pressure, and calm leadership.',
    reversedMeaning:
      'Reversed, the King of Cups warns of manipulation, suppression, mood masked as wisdom, or calm that refuses to be honest.',
    description:
      'A composed king sits above the sea with chalice and scepter, holding balance while waves gather around him.',
  },
  'ace-of-swords': {
    keywords: ['clarity', 'truth', 'breakthrough', 'decision'],
    uprightMeaning:
      'The Ace of Swords cuts through confusion. It brings truth, decisive thought, and the clean edge needed to name what is real.',
    reversedMeaning:
      'Reversed, the Ace of Swords shows clouded judgment, harsh words, withheld truth, or a decision made before the facts are clear.',
    description:
      'A single sword rises crowned through storm clouds, bright and severe as a new truth.',
  },
  'two-of-swords': {
    keywords: ['stalemate', 'choice', 'guardedness', 'pause'],
    uprightMeaning:
      'The Two of Swords holds still between opposing truths. It asks for inner quiet, not denial, before a difficult choice is made.',
    reversedMeaning:
      'Reversed, the Two of Swords points to avoidance breaking down, information surfacing, or a choice delayed until pressure forces movement.',
    description:
      'A blindfolded figure crosses two blades over the heart beside still water and a crescent moon.',
  },
  'three-of-swords': {
    keywords: ['heartbreak', 'sorrow', 'truth', 'release'],
    uprightMeaning:
      'The Three of Swords is pain made clear. It does not soften the wound, but it names the truth so healing can begin honestly.',
    reversedMeaning:
      'Reversed, the Three of Swords suggests recovery, forgiveness, old grief returning, or pain that must be removed one blade at a time.',
    description:
      'Three swords pierce a red heart-shaped shield as rain falls through a dark chapel sky.',
  },
  'four-of-swords': {
    keywords: ['rest', 'recovery', 'contemplation', 'truce'],
    uprightMeaning:
      'The Four of Swords demands rest after strain. Healing needs quiet, prayer, sleep, or distance from the battle.',
    reversedMeaning:
      'Reversed, the Four of Swords warns of restlessness, burnout, forced isolation, or returning too soon before recovery is complete.',
    description:
      'A knight rests like an effigy beneath chapel swords, held in sacred pause and pale window light.',
  },
  'five-of-swords': {
    keywords: ['conflict', 'defeat', 'tension', 'cost'],
    uprightMeaning:
      'The Five of Swords asks what victory has cost. Winning may be possible, but the card questions pride, strategy, and the damage left behind.',
    reversedMeaning:
      'Reversed, the Five of Swords can show reconciliation, withdrawal from conflict, lingering resentment, or accountability after harm.',
    description:
      'A lone figure gathers blades on a stormy shore while others turn away from the aftermath.',
  },
  'six-of-swords': {
    keywords: ['transition', 'passage', 'healing', 'distance'],
    uprightMeaning:
      'The Six of Swords moves away from troubled waters. It is not instant joy, but it is passage toward steadier ground.',
    reversedMeaning:
      'Reversed, the Six of Swords suggests resistance to transition, emotional baggage, unfinished departure, or a journey delayed.',
    description:
      'A boat crosses misty water with six swords standing in the hull, carrying sorrow toward a quieter shore.',
  },
  'seven-of-swords': {
    keywords: ['strategy', 'secrecy', 'avoidance', 'cunning'],
    uprightMeaning:
      'The Seven of Swords moves quietly and asks why. It can show strategy and independence, or avoidance dressed as cleverness.',
    reversedMeaning:
      'Reversed, the Seven of Swords reveals the hidden thing: confession, exposure, self-deception, or the need to change tactics.',
    description:
      'A stealthy figure slips from camp with stolen blades while two remain planted behind.',
  },
  'eight-of-swords': {
    keywords: ['restriction', 'fear', 'limitation', 'perspective'],
    uprightMeaning:
      'The Eight of Swords shows a prison partly made of belief. The limits are real, but not all of them are locked.',
    reversedMeaning:
      'Reversed, the Eight of Swords brings loosening bonds, a changed perspective, or the first refusal to cooperate with fear.',
    description:
      'A bound and blindfolded figure stands among eight blades, with an opening visible beyond the fear.',
  },
  'nine-of-swords': {
    keywords: ['anxiety', 'nightmare', 'guilt', 'distress'],
    uprightMeaning:
      'The Nine of Swords wakes in the dark with the mind turned sharp against itself. It asks for compassion, confession, and help with what is too heavy alone.',
    reversedMeaning:
      'Reversed, the Nine of Swords can show easing anxiety, hidden shame surfacing, or a spiral that needs interruption before it deepens.',
    description:
      'A figure sits awake beneath nine swords on the wall, surrounded by midnight and embroidered worry.',
  },
  'ten-of-swords': {
    keywords: ['ending', 'defeat', 'collapse', 'release'],
    uprightMeaning:
      'The Ten of Swords is the end of the line for a painful pattern. It is severe, but it is final; dawn begins because denial cannot continue.',
    reversedMeaning:
      'Reversed, the Ten of Swords suggests survival after collapse, resistance to an ending, or recovery beginning in small movements.',
    description:
      'A fallen figure lies under a dark sky as ten swords mark the finality of defeat and the first red line of dawn.',
  },
  'page-of-swords': {
    keywords: ['curiosity', 'watchfulness', 'truth-seeking', 'message'],
    uprightMeaning:
      'The Page of Swords studies the wind before speaking. It brings alertness, questions, investigation, and a young truth still learning tact.',
    reversedMeaning:
      'Reversed, the Page of Swords warns of gossip, defensiveness, scattered thought, or questions used as weapons.',
    description:
      'A young page holds a raised blade on a windy hill, sharp-eyed beneath fast-moving clouds.',
  },
  'knight-of-swords': {
    keywords: ['urgency', 'ambition', 'argument', 'speed'],
    uprightMeaning:
      'The Knight of Swords charges at the problem with full force. He brings courage and speed, but asks whether the mind is leading or merely attacking.',
    reversedMeaning:
      'Reversed, the Knight of Swords warns of recklessness, cruelty, tunnel vision, or a rush that creates the very conflict it meant to solve.',
    description:
      'An armored rider drives through storm wind with sword lifted, all edge, motion, and conviction.',
  },
  'queen-of-swords': {
    keywords: ['discernment', 'independence', 'honesty', 'boundaries'],
    uprightMeaning:
      'The Queen of Swords speaks from hard-earned clarity. She brings honesty, independence, clean boundaries, and wisdom without sentimentality.',
    reversedMeaning:
      'Reversed, the Queen of Swords can show bitterness, isolation, excessive criticism, or truth used without mercy.',
    description:
      'A throne-seated queen holds one upright sword and extends her hand, inviting truth but not confusion.',
  },
  'king-of-swords': {
    keywords: ['authority', 'logic', 'ethics', 'judgment'],
    uprightMeaning:
      'The King of Swords rules through principle. He asks for reason, ethics, strategy, and decisions that can withstand scrutiny.',
    reversedMeaning:
      'Reversed, the King of Swords warns of cold authority, manipulation, rigid thinking, or intellect separated from conscience.',
    description:
      'A severe king holds a vertical blade against a clear sky, crowned by law, reason, and responsibility.',
  },
  'ace-of-pentacles': {
    keywords: ['opportunity', 'prosperity', 'seed', 'material beginning'],
    uprightMeaning:
      'The Ace of Pentacles places a real opportunity in your hand. It asks for practical care, patience, and the willingness to grow something tangible.',
    reversedMeaning:
      'Reversed, the Ace of Pentacles warns of missed chances, poor planning, scarcity fear, or a gift that needs grounding before it can prosper.',
    description:
      'A golden pentacle is offered over a garden path and arched hedge, promising earth that can be worked.',
  },
  'two-of-pentacles': {
    keywords: ['balance', 'adaptation', 'priorities', 'change'],
    uprightMeaning:
      'The Two of Pentacles keeps motion balanced. It asks for flexible priorities, rhythm, and practical adjustment while conditions shift.',
    reversedMeaning:
      'Reversed, the Two of Pentacles shows overwhelm, disorganization, dropped obligations, or a life trying to juggle too much.',
    description:
      'A nimble figure loops two coins through an infinity ribbon while ships rise and fall behind him.',
  },
  'three-of-pentacles': {
    keywords: ['craft', 'collaboration', 'skill', 'apprenticeship'],
    uprightMeaning:
      'The Three of Pentacles honors skilled work done with others. Plans improve when craft, humility, and collaboration meet.',
    reversedMeaning:
      'Reversed, the Three of Pentacles suggests poor teamwork, ignored expertise, weak standards, or effort without coordination.',
    description:
      'A mason, monk, and patron confer beneath three carved pentacles in a chapel under construction.',
  },
  'four-of-pentacles': {
    keywords: ['security', 'control', 'possession', 'conservation'],
    uprightMeaning:
      'The Four of Pentacles protects what has been gained. It can mean wise conservation, but also the fear that turns safety into a locked room.',
    reversedMeaning:
      'Reversed, the Four of Pentacles shows release, financial instability, generosity after fear, or control finally loosening.',
    description:
      'A guarded figure clutches coins at crown, chest, and feet, fixed before a walled city.',
  },
  'five-of-pentacles': {
    keywords: ['hardship', 'poverty', 'exclusion', 'support'],
    uprightMeaning:
      'The Five of Pentacles walks through cold need beside a lit window. It shows hardship, but also asks where help is nearer than pride allows.',
    reversedMeaning:
      'Reversed, the Five of Pentacles points to recovery, accepting aid, spiritual warmth returning, or the first step out of scarcity.',
    description:
      'Two travelers pass a glowing chapel window of pentacles through snow, close to shelter but not yet inside.',
  },
  'six-of-pentacles': {
    keywords: ['generosity', 'exchange', 'fairness', 'support'],
    uprightMeaning:
      'The Six of Pentacles weighs giving and receiving. Resources move best when generosity is paired with dignity and clear balance.',
    reversedMeaning:
      'Reversed, the Six of Pentacles warns of debt, strings attached, unequal exchange, or help that preserves power instead of restoring it.',
    description:
      'A merchant gives coins while holding scales, with pentacles arranged around an act of measured charity.',
  },
  'seven-of-pentacles': {
    keywords: ['patience', 'assessment', 'investment', 'harvest'],
    uprightMeaning:
      'The Seven of Pentacles pauses in the field to assess growth. It asks whether continued patience, adjustment, or a new investment is needed.',
    reversedMeaning:
      'Reversed, the Seven of Pentacles shows impatience, poor returns, wasted effort, or a harvest neglected by inconsistent care.',
    description: 'A gardener leans on a staff before pentacles ripening slowly among vines.',
  },
  'eight-of-pentacles': {
    keywords: ['practice', 'discipline', 'craftsmanship', 'focus'],
    uprightMeaning:
      'The Eight of Pentacles is devotion through repetition. Skill grows because attention is given again and again to the work in front of you.',
    reversedMeaning:
      'Reversed, the Eight of Pentacles warns of perfectionism, boredom, shortcuts, or work that has lost its purpose.',
    description:
      'A craftsperson engraves pentacles one by one at a bench, surrounded by tools and disciplined effort.',
  },
  'nine-of-pentacles': {
    keywords: ['independence', 'refinement', 'self-worth', 'abundance'],
    uprightMeaning:
      'The Nine of Pentacles enjoys earned independence. It speaks of refinement, self-trust, solitude by choice, and abundance maintained with care.',
    reversedMeaning:
      'Reversed, the Nine of Pentacles can show dependence, self-worth tied to appearances, overspending, or luxury that does not nourish.',
    description:
      'An elegant figure stands in a vineyard with a falcon, surrounded by pentacles and cultivated ease.',
  },
  'ten-of-pentacles': {
    keywords: ['legacy', 'family', 'wealth', 'continuity'],
    uprightMeaning:
      'The Ten of Pentacles looks beyond one lifetime. It favors legacy, family systems, inheritance, institutions, and wealth that outlasts the moment.',
    reversedMeaning:
      'Reversed, the Ten of Pentacles warns of family conflict, unstable legacy, inherited burdens, or wealth without belonging.',
    description:
      'Generations gather beneath an arch while pentacles form a family tree over house, elder, and child.',
  },
  'page-of-pentacles': {
    keywords: ['study', 'opportunity', 'practice', 'manifestation'],
    uprightMeaning:
      'The Page of Pentacles studies the first coin with reverence. It brings learning, practical opportunity, and the discipline to make an idea real.',
    reversedMeaning:
      'Reversed, the Page of Pentacles suggests procrastination, poor study, missed practical details, or desire without practice.',
    description:
      'A young student holds a pentacle over fields and flowers, ready to learn what the earth requires.',
  },
  'knight-of-pentacles': {
    keywords: ['diligence', 'routine', 'reliability', 'patience'],
    uprightMeaning:
      'The Knight of Pentacles advances by steadiness. Slow work, routine, reliability, and responsibility carry more power here than speed.',
    reversedMeaning:
      'Reversed, the Knight of Pentacles warns of stagnation, stubbornness, drudgery, or responsibility used as an excuse not to grow.',
    description:
      'A still horse and armored rider hold a pentacle over plowed fields, patient and immovable.',
  },
  'queen-of-pentacles': {
    keywords: ['nurture', 'resources', 'practical care', 'comfort'],
    uprightMeaning:
      'The Queen of Pentacles makes care tangible. She brings nourishment, resourcefulness, domestic wisdom, and the ability to create comfort without losing strength.',
    reversedMeaning:
      'Reversed, the Queen of Pentacles can show neglect, smothering, financial strain, or giving so much that the body and home are depleted.',
    description:
      'A garden queen cradles a pentacle among roses, fruit, and a small creature at her feet.',
  },
  'king-of-pentacles': {
    keywords: ['stewardship', 'wealth', 'security', 'mastery'],
    uprightMeaning:
      'The King of Pentacles masters the material world through stewardship. He favors prosperity, stability, enterprise, and responsibility for what has been built.',
    reversedMeaning:
      'Reversed, the King of Pentacles warns of greed, rigidity, materialism, poor stewardship, or security bought at the cost of spirit.',
    description:
      'A prosperous king sits on a vine-carved throne with pentacle and scepter, surrounded by harvest and stone.',
  },
}

function cardImagePath(id: number, slug: string): string {
  return `/cards/${String(id).padStart(2, '0')}-${slug}.png`
}

export const minorArcana: TarotCard[] = minorSuits.flatMap((suit, suitIndex) =>
  minorRanks.map((rank, rankIndex) => {
    const id = 22 + suitIndex * minorRanks.length + rankIndex
    const details = minorCardDetails[`${rank.slug}-of-${suit.slug}`]

    if (!details) {
      throw new Error(`Missing tarot card details for ${rank.slug} of ${suit.slug}.`)
    }

    return {
      id,
      name: `${rank.name} of ${suit.name}`,
      numeral: rank.numeral,
      image: cardImagePath(id, `${rank.slug}-of-${suit.slug}`),
      keywords: details.keywords,
      uprightMeaning: details.uprightMeaning,
      reversedMeaning: details.reversedMeaning,
      description: details.description,
    }
  }),
)

export const tarotDeck: TarotCard[] = [...majorArcana, ...minorArcana]
