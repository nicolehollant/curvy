import FontAwesomeIcon from './font-awesome'

declare module '@vue/runtime-core' {
  export interface GlobalComponents {
    FAIcon: typeof FontAwesomeIcon
  }
}