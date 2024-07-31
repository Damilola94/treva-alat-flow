interface IPersonalInfoItem {
  label?: string
  value?: string
}

export function PersonalInfoItem (props: IPersonalInfoItem) {
  const { label, value } = props

  return (
    <div className="flex flex-col gap-2">
      <p className="app_personal_information__ctt__label">{label}</p>
      <p
        className={`app_personal_information__ctt__value  ${
          value ? '' : 'empty'
        }`}
      >
        {value ?? 'Empty'}
      </p>
    </div>
  )
}
