function speedSettings(props) {
    return (
        <Page>
            <Section
                title={<Text bold>Speed Settings</Text>}>
                <Select
                    label={`Temperature Unit`}
                    settingsKey="tempUnit"
                    options={[
                        { name: "Celsius" },
                        { name: "Farenheit" }
                    ]}
                />
                <Toggle
                    settingsKey="hideDate"
                    label="Hide Date"
                />
                <Toggle
                    settingsKey="hideWeather"
                    label="Hide Weather"
                />
                <Toggle
                    settingsKey="hideHeartRate"
                    label="Hide Heart Rate"
                />
                <Toggle
                    settingsKey="hideGoals"
                    label="Hide Goals"
                />
            </Section>
        </Page>
    );
}

registerSettingsPage(speedSettings);