import { TbMoon, TbSun } from "react-icons/tb";

import { ActionIcon, Group, useMantineColorScheme } from "@mantine/core";

export function ActionToggle() {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

  return (
    <Group position="center" my="xl">
      <ActionIcon
        onClick={() => toggleColorScheme()}
        size="lg"
        sx={(theme) => ({
          backgroundColor:
            theme.colorScheme === "dark"
              ? theme.colors.dark[6]
              : theme.colors.gray[0],
          color:
            theme.colorScheme === "dark"
              ? theme.colors.yellow[4]
              : theme.colors.blue[6],
        })}
      >
        {colorScheme === "dark" ? <TbSun size={18} /> : <TbMoon size={18} />}
      </ActionIcon>
    </Group>
  );
}
