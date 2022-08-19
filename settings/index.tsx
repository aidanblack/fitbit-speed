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
            </Section>
        </Page>
    );
}

registerSettingsPage(speedSettings);