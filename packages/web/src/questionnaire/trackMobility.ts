import type { Track } from '@/types'
import { HasInputOptions, TrackComponents, TrackId, TransportModes, YesNo, allTransportModes } from '@/types'

export const mobility: Track = {
  id: TrackId.Mobility,
  category: 'myMobility',
  title: { fr: 'Mode de transport' },
  label: {
    fr: 'Quel est le mode de transport principal des salariés pour le trajet domicile-travail ?'
  },
  callout: {
    header: { fr: 'Thématique' },
    headerStyle: 'color: #3A3A3A;',
    bgColor: '#1EBE8E',
    title: { fr: 'La mobilité dans votre entreprise' },
    titleStyle: 'color: #000091;',
    bigTitle: true,
    imageLeft: 'images/thema/thema-mobilite.svg'
  },
  interface: {
    component: TrackComponents.Buttons
  },
  behavior: {
    multipleChoices: false
  },
  next: {
    default: TrackId.MobilityNumberVehicles
  },
  options: [
    {
      value: {
        ...allTransportModes,
        [TransportModes.Bus]: YesNo.Yes
      },
      title: { fr: 'Bus' },
      label: { fr: '🚌 Le bus' },
      next: {
        default: TrackId.MobilityNumberVehicles
      }
    },
    {
      value: {
        ...allTransportModes,
        [TransportModes.Train]: YesNo.Yes
      },
      title: { fr: 'Train ou métro' },
      label: { fr: '🚆 Le train ou le métro' },
      next: {
        default: TrackId.MobilityNumberVehicles
      }
    },
    {
      value: {
        ...allTransportModes,
        [TransportModes.Car]: YesNo.Yes
      },
      title: { fr: 'Voiture' },
      label: { fr: '🚗 La voiture' },
      next: {
        default: TrackId.MobilityNumberVehicles
      }
    },
    {
      value: {
        ...allTransportModes,
        [TransportModes.Bike]: YesNo.Yes
      },
      title: { fr: 'Vélo' },
      label: { fr: '🚲 Le vélo' },
      next: {
        default: TrackId.MobilityNumberVehicles
      }
    },
    {
      value: {
        ...allTransportModes,
        [TransportModes.Motorcycle]: YesNo.Yes
      },
      title: { fr: 'Moto' },
      label: { fr: '🏍 La moto ou le scooter' },
      next: {
        default: TrackId.MobilityNumberVehicles
      }
    },
    {
      value: {
        ...allTransportModes,
        [TransportModes.Truck]: YesNo.Yes
      },
      title: { fr: 'Camion' },
      label: { fr: '🚐 Une camionette, un véhicule de chantier ou un poids lourd' },
      next: {
        default: TrackId.MobilityNumberVehicles
      }
    },
    {
      value: {
        ...allTransportModes,
        [TransportModes.Other]: YesNo.Yes
      },
      title: { fr: 'Autre' },
      label: { fr: 'Autre : ' },
      hasInput: HasInputOptions.Text,
      next: {
        default: TrackId.MobilityNumberVehicles
      }
    },
    {
      value: {
        ...allTransportModes,
        [TransportModes.Bike]: YesNo.Yes,
        [TransportModes.Bus]: YesNo.Yes,
        [TransportModes.Car]: YesNo.Yes,
        [TransportModes.Motorcycle]: YesNo.Yes,
        [TransportModes.Other]: YesNo.Yes,
        [TransportModes.Train]: YesNo.Yes,
        [TransportModes.Truck]: YesNo.Yes
      },
      title: { fr: 'Je ne sais pas' },
      label: { fr: 'Je ne sais pas' },
      next: {
        default: TrackId.MobilityNumberVehicles
      }
    }
  ]
}
